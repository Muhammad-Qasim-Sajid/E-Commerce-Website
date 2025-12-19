import { Request, Response, NextFunction } from "express";

export const asyncHandler = (fn: Function): ((req: Request, res: Response, next: NextFunction) => void) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default asyncHandler;