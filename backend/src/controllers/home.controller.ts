import { Request, Response } from "express";
import { ZodError } from "zod";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { uploadOnCloudinary, deleteFromCloudinary} from "../utils/cloudinary.utils.js";
import { createHomePageSchema } from "../types/validation.types.js";
import { Home } from "../models/home.model.js";

export const editHomePage = asyncHandler(async (req: Request, res: Response) => {

    const existingHome = await Home.findById("homePage");

    if (!existingHome && !req.file?.path) {
        return ApiError(res, 400, "Hero Image is required for creating home page");
    }

    let parsedBody;
    try {
        parsedBody = {
            ...req.body,
            whyUs: JSON.parse(req.body.whyUs),
            whatOurClientsSay: JSON.parse(req.body.whatOurClientsSay)
        };
    } catch {
        return ApiError(res, 400, "Invalid JSON format for nested fields");
    }

    const validation = createHomePageSchema.safeParse(parsedBody);
    if (!validation.success) {
        const error: ZodError = validation.error;
        const messages = error.issues.map(issue => issue.message).join(", ");
        return ApiError(res, 400, messages);
    }

    let heroImageUrl;

    if (req.file?.path) {
        try {
            heroImageUrl = await uploadOnCloudinary(req.file.path);

            if (existingHome?.heroImage) {
                await deleteFromCloudinary(existingHome.heroImage);
            }
        } catch {
            return ApiError(res, 500, "Failed to upload hero image on cloudinary");
        }
    } else if (existingHome) {
        heroImageUrl = existingHome.heroImage;
    }

    const updateData = {
        ...validation.data,
        heroImage: heroImageUrl
    };

    try {
        const home = await Home.findByIdAndUpdate(
            "homePage",
            updateData,
            { 
                new: true, 
                upsert: true, 
                runValidators: true,
                setDefaultsOnInsert: true 
            }
        );

        const message = existingHome 
            ? "Home page updated successfully" 
            : "Home page created successfully";

        return ApiResponse(res, 201, message, home);
    } catch (err: any) {
        return ApiError(res, 500, "Database error: " + err.message);
    }

});

export const getHomePage = asyncHandler(async (req: Request, res: Response) => {
    const home = await Home.findById("homePage");
    if (!home) {
        return ApiError(res, 404, "Home page not found");
    }
    return ApiResponse(res, 200, "Home page retrieved successfully", home);
});