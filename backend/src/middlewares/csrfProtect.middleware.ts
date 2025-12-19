import { Request, Response, NextFunction } from "express";
import ApiResponse from "../utils/apiResponse.utils.js";

export const csrfProtect = (req: Request, res: Response, next: NextFunction): Response | void => {
    const csrfCookie = req.cookies?.csrfToken;
    const csrfHeader = req.headers["x-csrf-token"];

    if (typeof csrfCookie !== "string" || typeof csrfHeader !== "string" || csrfCookie !== csrfHeader ) {
        return ApiResponse(res, 403, "Invalid CSRF token");
    }

    next();
};