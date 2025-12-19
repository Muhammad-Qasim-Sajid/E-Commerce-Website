import { Response } from "express";

const ApiResponse = (res: Response, statusCode: number, message: string, data?: any): Response => {
    return res.status(statusCode).json({
        success: statusCode >= 200 && statusCode < 300,
        message,
        data: data
    });
};

export default ApiResponse;