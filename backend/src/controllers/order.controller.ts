import mongoose from "mongoose";
import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { orderPageSchema } from "../types/validation.types.js";
import { ShippingPrice } from "../models/shippingPrice.model.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { ORDERS_LIMIT } from "../constants.js";

export const addOrder = asyncHandler(async (req: Request, res: Response) => {

    const parsed = orderPageSchema.safeParse(req.body);
    if (!parsed.success) {
        const message = parsed.error.issues.map(i => i.message).join(", ");
        throw new ApiError(400, message);
    }

    const { customerName, customerEmail, customerPhone, customerAddress, items } = parsed.data;

    const shippingDoc = await ShippingPrice.findOne();
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
                ).session(session);

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
                        $inc: { "variants.$.variantStock": -item.quantity } 
                    },
                    { session }
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
                        orderStatus: "Processing"
                }],
                { session }
            );
            return order[0];
        });

        return ApiResponse(res, 201, "Order placed successfully", createdOrder);
    } finally {
        session.endSession();
    }

});

export const editPaymentStatus = asyncHandler(async (req: Request, res: Response) => {
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

export const editOrderStatus = asyncHandler(async (req: Request, res: Response) => {
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

export const editTrackingNumber = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "ID is required");

    const { trackingNumber } = req.body;
    if (!trackingNumber || typeof trackingNumber !== "string") {
        throw new ApiError(400, "Tracking number is required and must be a string");
    }

    const order = await Order.findById(id);
    if (!order) throw new ApiError(404, "Order not found");

    if (order.trackingNumber === trackingNumber) {
        return ApiResponse(res, 200, "Tracking number is already up-to-date", order);
    }

    order.trackingNumber = trackingNumber;
    await order.save();

    return ApiResponse(res, 200, "Tracking number updated successfully", order);
});

export const getOrder = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "ID is required");
    }

    const order = await Order.findById(id).populate("items.productId", "name");

    if (!order) {
        throw new ApiError(404, "Order not found");
    }
    return ApiResponse(res, 200, "Order retrieved successfully", order);
});

const fetchOrders = async (filter: Record<string, any>, cursor?: string) => {
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
        .populate("items.productId", "name");

    const hasMore = orders.length > ORDERS_LIMIT;
    if (hasMore) orders.pop();

    return {
        orders,
        hasMore,
        nextCursor: orders.length ? orders[orders.length - 1].createdAt : null
    }
};

export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const data = await fetchOrders({}, req.query.cursor as string);
    return ApiResponse(res, 200, "Orders retrieved successfully", data);
});

export const deleteOrder = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "ID is required");

    const order = await Order.findByIdAndDelete(id);
    if (!order) throw new ApiError(404, "Order not found");

    return ApiResponse(res, 200, "Order deleted successfully", order);
});