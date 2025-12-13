// Body

import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { editFaqsPageSchema } from "../types/validation.types.js";
import { FAQs } from "../models/faqs.model.js";

export const editFaqs = asyncHandler(async(req: Request, res: Response) => {

    console.log(req.body) // Debug log

    const parsed = editFaqsPageSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(issue => issue.message).join(", ");
        throw new ApiError(400, messages);
    }

    console.log(parsed); // Debug log

    const faqs = await FAQs.findOneAndUpdate(
        { _id: "faqs"},
        parsed.data,
        {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true
        }
    );

    return ApiResponse(res, 200, "FAQs updated successfully", faqs);

});

export const getFaqs = asyncHandler(async(req: Request, res: Response) => {
    const faqs = await FAQs.findById("faqs");
    if(!faqs) {
        throw new ApiError(404, "FAQs not found");
    }
    return ApiResponse(res, 200, "FAQs retrieved successfully", faqs);
});