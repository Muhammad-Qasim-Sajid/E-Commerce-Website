import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { Order } from "../models/order.model.js";

export const getClients = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const clients = await Order.aggregate([
        {
            $group: {
                _id: "$customerEmail",
                name: { $first: "$customerName" },
                email: { $first: "$customerEmail" },
                phone: { $first: "$customerPhone" },
                address: { $first: "$customerAddress" },
                totalSpent: { $sum: "$totalPrice" },
                orderCount: { $sum: 1 },
                firstOrderDate: { $min: "$createdAt" },
                lastOrderDate: { $max: "$createdAt" }
            }
        },
        { $sort: { lastOrderDate: -1 } }
    ]);

    const formattedClients = clients.map(client => ({
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address,
        totalSpent: client.totalSpent,
        orderCount: client.orderCount,
        firstOrderDate: client.firstOrderDate,
        lastOrderDate: client.lastOrderDate
    }));

    return ApiResponse(res, 200, "Clients retrieved successfully", {
        clients: formattedClients,
        totalClients: formattedClients.length
    });
});