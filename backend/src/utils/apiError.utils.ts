import { Response } from "express";

const ApiError = (res: Response, statusCode: number, message: string) => {
    return res.status(statusCode).json({
        success: false,
        message,
        data: null
    });
};

export default ApiError;