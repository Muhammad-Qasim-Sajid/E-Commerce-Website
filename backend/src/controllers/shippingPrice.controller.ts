import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { ShippingPrice } from "../models/shippingPrice.model.js";

export const editShippingPrice = asyncHandler(async (req: Request, res: Response) => {
    const { shippingPrice } = req.body;

    if (!shippingPrice || typeof shippingPrice !== "number" || shippingPrice < 0) {
        throw new ApiError(400, "Invalid shipping price");
    }

    const editedShipping = await ShippingPrice.findOneAndUpdate(
        {},
        { shippingPrice },
        {
            upsert: true,
            new: true,
            runValidators: true,
            setDefaultsOnInsert: true
        }
    );

    return ApiResponse(res, 200, "Shipping price edited successfully", editedShipping);
});

export const getShippingPrice = asyncHandler(async (req: Request, res: Response) => {
    const shipping = await ShippingPrice.findOne();

    if (!shipping) {
        throw new ApiError(404, "Shipping price not configured");
    }

    return ApiResponse(res, 200, "Shipping price retrieved successfully", shipping);
});