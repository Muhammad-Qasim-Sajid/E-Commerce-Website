import { Request, Response, NextFunction } from "express";

const globalErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack || error); // Debug log

    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";

    res.status(statusCode).json({
        success: false,
        message,
        data: null
    });
};

export default globalErrorHandler;