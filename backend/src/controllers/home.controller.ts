// Form data

import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils.js";
import { cleanupFile } from "../utils/cleanup.js";
import { editHomePageSchema } from "../types/validation.types.js";
import { Home } from "../models/home.model.js";
import { Product } from "../models/product.model.js";

export const editHomePage = asyncHandler(async (req: Request, res: Response): Promise<Response> => {

    console.log(req.body); // Debug log

    let parsedBody;
    try {
        parsedBody = {
            ...req.body,
            whyUs: JSON.parse(req.body.whyUs),
            whatOurClientsSay: JSON.parse(req.body.whatOurClientsSay),
        };
    } catch {
        cleanupFile(req.file);
        throw new ApiError(400, "Invalid JSON format in nested fields");
    }

    console.log(parsedBody); // Debug log

    const validated = editHomePageSchema.safeParse(parsedBody);
    if (!validated.success) {
        const message = validated.error.issues.map(i => i.message).join(", ");
        cleanupFile(req.file);
        throw new ApiError(400, message);
    }


    const existingHome = await Home.findById("homePage").lean();
    if (!existingHome && !req.file?.path) {
        throw new ApiError(400, "Hero image is required to create home page");
    }

    let heroImage = existingHome?.heroImage;
    let newUploadedImage: string | null = null;
    let oldImageUrl: string | undefined = undefined;

    if (req.file?.path) {
        try {
            newUploadedImage = await uploadOnCloudinary(req.file.path);
            heroImage = newUploadedImage;
            oldImageUrl = existingHome?.heroImage;
        } catch (error: any) {
            throw new ApiError(500, `Hero image upload failed: ${error.message || "Unknown error"}`);
        }
    }

    try {
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

        if (newUploadedImage && oldImageUrl) {
            await deleteFromCloudinary(oldImageUrl);
        }

        return ApiResponse(
            res,
            200,
            existingHome
                ? "Home page updated successfully"
                : "Home page created successfully",
            home
        );
    } catch (error: any) {
        if (newUploadedImage) await deleteFromCloudinary(newUploadedImage);
        throw new ApiError(500, `Database error: ${error.message || "Unknown error"}`);
    }
});

export const getHomePage = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const home = await Home.findById("homePage").lean();
    if (!home) {
        throw new ApiError(404, "Home page not found");
    }
    const featuredProducts = await Product.find({ "featuredProduct": true }).limit(5).lean();
    const homeWithFeaturedProducts = {
        ...home,
        featuredProducts
    }

    return ApiResponse(res, 200, "Home page retrieved successfully", homeWithFeaturedProducts);
});