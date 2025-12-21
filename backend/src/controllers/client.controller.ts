import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";;
import { Order } from "../models/order.model.js";
import { ORDERS_LIMIT } from "../constants.js";

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

export const getClients = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const data = await fetchOrders({}, req.query.cursor as string);
    return ApiResponse(res, 200, "Orders retrieved successfully", data);
});