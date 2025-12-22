import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

export const getDashboard = asyncHandler(async(req: Request, res: Response) => {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const [ totalOrders, totalRevenue, ordersThisMonth, revenueThisMonth ] = await Promise.all([
            Order.countDocuments(),
            Order.aggregate([
                {
                    $match: { 
                        paymentStatus: "Paid",
                        orderStatus: { $ne: "Cancelled" }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalPrice" }
                    }
                }
            ]),
            Order.countDocuments({
                createdAt: { $gte: startOfMonth, $lte: endOfMonth }
            }),
            Order.aggregate([
                {
                    $match: { 
                        paymentStatus: "Paid",
                        orderStatus: { $ne: "Cancelled" },
                        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                    }
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalPrice" }
                    }
                }
            ])
        ]);

        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(4).select('-trackingToken').populate("items.productId", "name").lean();

        const topProducts = await Order.aggregate([
            { $unwind: "$items" },
            { 
                $match: { 
                    paymentStatus: "Paid",
                    orderStatus: { $ne: "Cancelled" }
                } 
            },
            {
                $group: {
                    _id: "$items.productId",
                    totalQuantity: { $sum: "$items.quantity" },
                    totalRevenue: { $sum: "$items.totalPrice" },
                    variantSnapshot: { $first: "$items.variantSnapshot" }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 4 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productDetails"
                }
            },
            { $unwind: "$productDetails" },
            {
                $project: {
                    productId: "$_id",
                    productName: "$productDetails.name",
                    variantName: "$variantSnapshot.name",
                    variantImage: "$variantSnapshot.image",
                    totalQuantity: 1,
                    totalRevenue: 1
                }
            }
        ]);

        const pendingOrders = await Order.find({ orderStatus: "Pending" }).sort({ createdAt: -1 }).select('-trackingToken').populate("items.productId", "name").lean();

        const lowStockAlerts = await Product.aggregate([
            { $unwind: "$variants" },
            {
                $match: {
                    "variants.variantStock": { $lte: 10 }
                }
            },
            { $sort: { "variants.variantStock": 1 } },
            {
                $project: {
                    _id: 0,
                    productId: "$_id",
                    productName: "$name",
                    variantName: "$variants.variantName",
                    variantImage: "$variants.variantImage",
                    remainingStock: "$variants.variantStock"
                }
            }
        ]);

        const dashboardData = {
            stats: {
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                ordersThisMonth,
                revenueThisMonth: revenueThisMonth[0]?.total || 0
            },
            recentOrders: recentOrders.map(order => ({
                _id: order._id,
                customer: order.customerName,
                date: new Date(order.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                items: order.items.reduce((sum, item) => sum + item.quantity, 0),
                amount: order.totalPrice,
                status: order.orderStatus,
                paymentStatus: order.paymentStatus
            })),
            topCollections: topProducts.map(product => ({
                productId: product.productId,
                name: product.productName,
                variant: product.variantName,
                image: product.variantImage,
                sales: product.totalQuantity,
                revenue: product.totalRevenue
            })),
            pendingOrders: pendingOrders.map(order => ({
                _id: order._id,
                customerName: order.customerName,
                customerEmail: order.customerEmail,
                createdAt: order.createdAt,
                items: order.items,
                totalPrice: order.totalPrice,
                paymentStatus: order.paymentStatus
            })),
            lowStockAlerts: lowStockAlerts.map(alert => ({
                productId: alert.productId,
                collection: alert.productName,
                variant: alert.variantName,
                image: alert.variantImage,
                remaining: alert.remainingStock
            }))
        };

        return ApiResponse(res, 200, "Dashboard data retrieved successfully", dashboardData);
});