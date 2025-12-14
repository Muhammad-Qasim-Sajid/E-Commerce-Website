// Body

import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { editOurStoryPageSchema } from "../types/validation.types.js";
import { OurStory } from "../models/ourStory.model.js";

export const editOurStoryPage = asyncHandler(async (req: Request, res: Response) => {

    console.log(req.body); // Debug log

    const parsed = editOurStoryPageSchema.safeParse(req.body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(issue => issue.message).join(", ");
        throw new ApiError(400, messages);
    }

    console.log(parsed); // Debug log

    const ourStory = await OurStory.findOneAndUpdate(
        { _id: "ourStory" },
        parsed.data,
        {
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
            new: true
        }
    );

    return ApiResponse(res, 200, "Our Story page updated successfully", ourStory);

});

export const getOurStoryPage = asyncHandler(async (req: Request, res: Response) => {
    const ourStory = await OurStory.findById("ourStory");
    if(!ourStory) {
        throw new ApiError(404, "Our Story page is not found");
    }
    return ApiResponse(res, 200, "Our Story Page retrieved successfully", ourStory);
});