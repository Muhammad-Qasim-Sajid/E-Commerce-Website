// Body, Pramas, Query

import mongoose from "mongoose";
import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { orderPageSchema } from "../types/validation.types.js";
import { ShippingPrice } from "../models/shippingPrice.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { ORDERS_LIMIT } from "../constants.js";
import sendEmail from "../utils/sendEmail.utils.js";
import generateTrackingToken from "../utils/generateTrackingToken.utils.js";
import orderConfirmationEmail from "../utils/orderConfirmationEmail.utils.js";

export const addOrder = asyncHandler(async (req: Request, res: Response): Promise<Response> => {

    const parsed = orderPageSchema.safeParse(req.body);
    if (!parsed.success) {
        const message = parsed.error.issues.map(i => i.message).join(", ");
        throw new ApiError(400, message);
    }

    const { customerName, customerEmail, customerPhone, customerAddress, items } = parsed.data;

    const shippingDoc = await ShippingPrice.findOne().lean();
    if (!shippingDoc) {
        throw new ApiError(500, "Shipping price not configured");
    }
    const shippingPrice = shippingDoc.shippingPrice;

    const session = await mongoose.startSession();
    let createdOrder;

    try {
        createdOrder = await session.withTransaction(async () => {
            let calculatedTotal = 0;
            const rebuiltItems = [];

            for (const item of items) {

                const product = await Product.findOne(
                    { 
                        _id: item.productId, 
                        "variants._id": item.variantId 
                    },
                    { name: 1, variants: 1 }
                ).session(session).lean();

                if (!product) {
                    throw new ApiError(404, "Product or variant not found");
                }

                const variant = product.variants.id(item.variantId);
                if (!variant) {
                    throw new ApiError(404, `Variant not found for ${product.name}`);
                }

                if (variant.variantStock === undefined || variant.variantStock < item.quantity) {
                    throw new ApiError(400, `Insufficient stock for ${product.name} - ${variant.variantName}`);
                }

                const stockUpdate = await Product.updateOne(
                    { 
                        _id: product._id,
                        "variants._id": variant._id,
                        "variants.variantStock": { $gte: item.quantity }
                    },
                    {
                        $inc: { "variants.$[v].variantStock": -item.quantity }
                    },
                    {
                        arrayFilters: [{ "v._id": variant._id }],
                        session
                    }
                );


                if (stockUpdate.modifiedCount === 0) { // How many documents were actually updated???
                    throw new ApiError(400, `Stock conflict for ${product.name} - ${variant.variantName}`);
                }

                const itemTotal = variant.variantPrice * item.quantity;
                rebuiltItems.push({
                    productId: product._id,
                    variantId: variant._id,
                    variantSnapshot: {
                        name: variant.variantName,
                        price: variant.variantPrice,
                        image: variant.variantImage
                    },
                    quantity: item.quantity,
                    totalPrice: itemTotal
                });

                calculatedTotal += itemTotal;
            }

            calculatedTotal += shippingPrice;

            const order = await Order.create(
                [{
                        customerName,
                        customerEmail,
                        customerPhone,
                        customerAddress,
                        items: rebuiltItems,
                        shippingPrice,
                        totalPrice: calculatedTotal,
                        paymentStatus: "Pending",
                        orderStatus: "Processing",
                        trackingToken: "TEMP"
                }],
                { session }
            );

            const trackingToken = generateTrackingToken(order[0]._id.toString(), customerEmail);
            order[0].trackingToken = trackingToken;
            await order[0].save({ session });
            return order[0];
        });
    } finally {
        session.endSession();
    }

    const trackingUrl = `${process.env.FRONTEND_URL}/order/track-order?token=${createdOrder.trackingToken}`;

    try {
        await sendEmail({
            to: createdOrder.customerEmail,
            subject: "Order Confirmation & Order Tracking",
            html: orderConfirmationEmail({
                customerName: createdOrder.customerName,
                customerAddress: createdOrder.customerAddress,
                totalPrice: createdOrder.totalPrice,
                trackingUrl,
            }),
        });
    } catch (error) {
        console.log("EMAIL_FAILURE:", error); // Debug log
    }

    return ApiResponse(res, 201, "Order placed successfully", createdOrder);

});

interface OrderTrackingPayload extends JwtPayload {
    orderId: string;
    email: string;
    type: "order_tracking";
}

export const trackOrder = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { token } = req.query;
    if (typeof token !== "string") throw new ApiError(400, "Invalid tracking token");

    let payload: OrderTrackingPayload;
    try {
        const decoded = jwt.verify(token, process.env.TRACKING_SECRET as string);
        if (typeof decoded !== "object" || decoded === null) {
            throw new ApiError(401, "Invalid tracking token");
        }
        payload = decoded as OrderTrackingPayload;
    } catch {
        throw new ApiError(401, "Invalid or expired tracking token");
    }

    if (payload.type !== "order_tracking") {
        throw new ApiError(403, "Invalid token type");
    }

    const order = await Order.findOne({ _id: payload.orderId, trackingToken: token }).populate("items.productId", "name").lean();
    if (!order) throw new ApiError(404, "Order not found");

    if (order.customerEmail !== payload.email) throw new ApiError(403, "Unauthorized access");

    return ApiResponse(res, 200, "Order retrieved for tracking", {
        orderId: order._id,
        customerName: order.customerName,
        customerAddress: order.customerAddress,
        items: order.items,
        totalPrice: order.totalPrice,
        shippingPrice: order.shippingPrice,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        shippingTrackingNumber: order.shippingTrackingNumber ?? null,
        createdAt: order.createdAt,
    });
});

export const editPaymentStatus = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "ID is required");

    const { paymentStatus } = req.body;
    if (!paymentStatus) throw new ApiError(400, "Payment status is required");

    const validStatuses = ["Pending", "Paid", "Failed"];
    if (!validStatuses.includes(paymentStatus)) {
        throw new ApiError(400, `Payment status must be one of: ${validStatuses.join(", ")}`);
    }

    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.paymentStatus === paymentStatus) {
        return ApiResponse(res, 200, "Payment status is already up-to-date", order);
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    return ApiResponse(res, 200, "Payment status updated successfully", order);
});

export const editOrderStatus = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "ID is required");

    const { orderStatus } = req.body;
    if (!orderStatus) throw new ApiError(400, "Order status is required");

    const validStatuses = ["Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(orderStatus)) {
        throw new ApiError(400, `Order status must be one of: ${validStatuses.join(", ")}`);
    }

    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.orderStatus === orderStatus) {
        return ApiResponse(res, 200, "Order status is already up-to-date", order);
    }

    order.orderStatus = orderStatus;
    await order.save();

    return ApiResponse(res, 200, "Order status updated successfully", order);
});

export const editShippingTrackingNumber = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "ID is required");

    const { shippingTrackingNumber } = req.body;
    if (!shippingTrackingNumber || typeof shippingTrackingNumber !== "string") {
        throw new ApiError(400, "Shipping tracking number is required and must be a string");
    }

    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.shippingTrackingNumber === shippingTrackingNumber) {
        return ApiResponse(res, 200, "Shipping tracking number is already up-to-date", order);
    }

    order.shippingTrackingNumber = shippingTrackingNumber;
    await order.save();

    return ApiResponse(res, 200, "Shipping tracking number updated successfully", order);
});

export const getOrder = asyncHandler(async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "ID is required");
    }

    const order = await Order.findById(id).populate("items.productId", "name").lean();

    if (!order) {
        throw new ApiError(404, "Order not found");
    }
    return ApiResponse(res, 200, "Order retrieved successfully", order);
});

const fetchOrders = async (filter: Record<string, any>, cursor?: string): Promise<{
    orders: any[];
    hasMore: boolean;
    nextCursor: Date | null;
}> => {
    const query: any = { ...filter };

    if (cursor) {
        const date = new Date(cursor);
        if (isNaN(date.getTime())) {
            throw new ApiError(400, "Invalid cursor");
        }
        query.createdAt = { $lt: date };
    }

    const orders = await Order.find(query)
        .sort({ createdAt: -1 })
        .limit(ORDERS_LIMIT + 1)
        .populate("items.productId", "name")
        .lean();

    const hasMore = orders.length > ORDERS_LIMIT;
    if (hasMore) orders.pop();

    return {
        orders,
        hasMore,
        nextCursor: orders.length ? orders[orders.length - 1].createdAt : null
    }
};

export const getAllOrders = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const data = await fetchOrders({}, req.query.cursor as string);
    return ApiResponse(res, 200, "Orders retrieved successfully", data);
});

export const deleteOrder = asyncHandler(async(req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "ID is required");

    const order = await Order.findByIdAndDelete(id).lean();
    if (!order) throw new ApiError(404, "Order not found");

    return ApiResponse(res, 200, "Order deleted successfully", order);
});