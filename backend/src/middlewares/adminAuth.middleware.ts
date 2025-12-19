import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { Admin } from "../models/admin.model.js";

export const adminAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.adminToken;
        if (!token) return ApiResponse(res, 401, "Unauthorized");

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const admin = await Admin.findById(decoded.id);

        if (!admin) return ApiResponse(res, 401, "Unauthorized");

        next();
    } catch {
        return ApiResponse(res, 401, "Unauthorized");
    }
});