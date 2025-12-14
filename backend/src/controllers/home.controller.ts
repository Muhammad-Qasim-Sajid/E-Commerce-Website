// Form data

import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils.js";
import { editHomePageSchema } from "../types/validation.types.js";
import { Home } from "../models/home.model.js";

export const editHomePage = asyncHandler(async (req: Request, res: Response) => {

    console.log(req.body); // Debug log

    let parsedBody;
    try {
        parsedBody = {
            ...req.body,
            whyUs: JSON.parse(req.body.whyUs),
            whatOurClientsSay: JSON.parse(req.body.whatOurClientsSay),
        };
    } catch {
        throw new ApiError(400, "Invalid JSON format in nested fields");
    }

    console.log(parsedBody); //Debug log

    const validated = editHomePageSchema.safeParse(parsedBody);
    if (!validated.success) {
        const message = validated.error.issues.map(issue => issue.message).join(", ");
        throw new ApiError(400, message);
    }

    const existingHome = await Home.findById("homePage");
    if (!existingHome && !req.file?.path) {
        throw new ApiError(400, "Hero image is required to create home page");
    }

    let heroImage = existingHome?.heroImage;
    if (req.file?.path) {
        const uploaded = await uploadOnCloudinary(req.file.path);

        if (!uploaded) {
            throw new ApiError(500, "Hero image upload failed");
        }

        if (existingHome?.heroImage) {
            await deleteFromCloudinary(existingHome.heroImage);
        }

        heroImage = uploaded;
    }

    const home = await Home.findOneAndUpdate(
        { _id: "homePage" },
        {
            ...validated.data,
            heroImage,
        },
        {
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
            new: true
        }
    );

    return ApiResponse(
        res,
        200,
        existingHome
        ? "Home page updated successfully"
        : "Home page created successfully",
        home
    );

});

export const getHomePage = asyncHandler(async (req: Request, res: Response) => {
    const home = await Home.findById("homePage");
    if (!home) {
        throw new ApiError(404, "Home page not found");
    }
    return ApiResponse(res, 200, "Home page retrieved successfully", home);
});