// Body

import { Request, Response } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { Admin } from "../models/admin.model.js";

export const adminCreate = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    if (process.env.ALLOW_ADMIN_CREATE !== "true") {
        return ApiResponse(res, 403, "Disabled");
    }

    const { email, password } = req.body;

    const exists = await Admin.findOne().lean();
    if (exists) return ApiResponse(res, 400, "Admin already exists");

    const hashedPassword = await bcrypt.hash(password, 12);
    const admin = await Admin.create({ email, password: hashedPassword });

    return ApiResponse(res, 201, "Admin created", admin.email);
});

export const adminLogin = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).lean();
    if (!admin) return ApiResponse(res, 401, "Invalid credentials");

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return ApiResponse(res, 401, "Invalid credentials");

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
    });

    const csrfToken = crypto.randomBytes(32).toString("hex");

    res
        .cookie("adminToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .cookie("csrfToken", csrfToken, {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

    return ApiResponse(res, 200, "Logged in successfully");
});

export const isAdmin = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const token = req.cookies?.adminToken;
    if (!token) throw new ApiError(401, "Unauthorized");

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const admin = await Admin.findById(decoded.id).lean();

    if (!admin) throw new ApiError(401, "Unauthorized");

    return ApiResponse(res, 200, "Authorized");
});

export const adminLogout = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    res
        .clearCookie("adminToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        })
        .clearCookie("csrfToken", {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
        });
    return ApiResponse(res, 200, "Logged out successfully");
});