// Form data, Params

import { Request, Response } from "express";
import { z } from "zod";
import asyncHandler from "../utils/asyncHandler.utils.js";
import ApiError from "../utils/apiError.utils.js";
import ApiResponse from "../utils/apiResponse.utils.js";
import { productPageSchema, variantSchema } from "../types/validation.types.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.utils.js";
import { cleanupFiles } from "../utils/cleanup.js";
import { Product } from "../models/product.model.js";

export const addProduct = asyncHandler(async (req: Request, res: Response) => {

    console.log(req.body); // Debug log

    let variantsRaw;
    try {
        variantsRaw = JSON.parse(req.body.variants);
    } catch {
        cleanupFiles(req.files as Express.Multer.File[]);
        throw new ApiError(400, "Invalid JSON format for variants");
    }

    const body = { ...req.body, variants: variantsRaw };

    console.log(body); // Debug log

    if (body.featuredProduct !== undefined) {
        body.featuredProduct = body.featuredProduct === "true";
    }

    const parsed = productPageSchema.safeParse(body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(i => i.message).join(", ");
        cleanupFiles(req.files as Express.Multer.File[]);
        throw new ApiError(400, messages);
     }

    type VariantWithImage = z.infer<typeof variantSchema> & { variantImage: string };
    const variants: VariantWithImage[] = parsed.data.variants.map(v => ({
        ...v,
        variantImage: ""
    }));

    const files = req.files as Express.Multer.File[];
    if (!files || files.length !== variants.length) {
        cleanupFiles(files);
        throw new ApiError(400, "Each variant must have exactly one image");
    }

    const uploadedUrls: string[] = [];
    try {
        for (let i = 0; i < variants.length; i++) {
            const url = await uploadOnCloudinary(files[i].path);
            variants[i].variantImage = url;
            uploadedUrls.push(url);
        }
    } catch {
        if (uploadedUrls.length > 0) {
            await Promise.allSettled(uploadedUrls.map(deleteFromCloudinary));
        }
        throw new ApiError(500, "Image upload failed");
    }

    try {
        const product = await Product.create({ ...parsed.data, variants });
        return ApiResponse(res, 201, "Product created successfully", product);
    } catch (error: any) {
        await Promise.allSettled(uploadedUrls.map(deleteFromCloudinary));
        const errorMessage =  error.message || "Unknown error";
        throw new ApiError(500, `Database error: ${errorMessage}`);
    }

});

export const editProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        cleanupFiles(req.files as Express.Multer.File[]);
        throw new ApiError(400, "ID is required")
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
        cleanupFiles(req.files as Express.Multer.File[]);
        throw new ApiError(404, "Product not found");
    }

    let variantsRaw;
    try {
        variantsRaw = JSON.parse(req.body.variants);
    } catch {
        cleanupFiles(req.files as Express.Multer.File[]);
        throw new ApiError(400, "Invalid JSON format for variants");
    }

    const body = { ...req.body, variants: variantsRaw };

    if (body.featuredProduct !== undefined) {
        body.featuredProduct = body.featuredProduct === "true";
    }

    const parsed = productPageSchema.safeParse(body);
    if (!parsed.success) {
        const messages = parsed.error.issues.map(i => i.message).join(", ");
        cleanupFiles(req.files as Express.Multer.File[]);
        throw new ApiError(400, messages);
    }

    type VariantWithImage = z.infer<typeof variantSchema> & { variantImage: string };
    const updatedVariants: VariantWithImage[] = parsed.data.variants.map((v, index) => {
        const existingVariant = existingProduct.variants[index];
        return {
            ...v,
            variantImage: existingVariant ? existingVariant.variantImage : ""
        };
    });

    const files = req.files as Express.Multer.File[] | undefined;
    const uploadedUrls: string[] = [];

    try {
        if (files && files.length > 0) {
            if (files.length !== updatedVariants.length) {
                cleanupFiles(files);
                throw new ApiError(400, "Each variant must have exactly one image");
            }

            for (let i = 0; i < updatedVariants.length; i++) {
                if (files[i]?.path) {
                    const url = await uploadOnCloudinary(files[i].path);
                    uploadedUrls.push(url);

                    const oldImage = updatedVariants[i].variantImage;
                    updatedVariants[i].variantImage = url;

                    if (oldImage) {
                        await deleteFromCloudinary(oldImage);
                    }
                }
            }
        }
    } catch (err: any) {
        cleanupFiles(files);
        if (uploadedUrls.length > 0) {
            await Promise.allSettled(uploadedUrls.map(deleteFromCloudinary));
        }
        throw new ApiError(500, `Image upload failed: ${err.message || "Unknown error"}`);
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                ...parsed.data,
                variants: updatedVariants
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) throw new ApiError(500, "Failed to update product");

        const oldImages = existingProduct.variants.map(v => v.variantImage).filter(Boolean);
        const newImages = updatedVariants.map(v => v.variantImage).filter(Boolean);

        const imagesToDelete = oldImages.filter(img => !newImages.includes(img));

        if (imagesToDelete.length > 0) {
            await Promise.allSettled(imagesToDelete.map(deleteFromCloudinary));
        }

        return ApiResponse(res, 200, "Product updated successfully", updatedProduct);
    } catch (error: any) {
        if (uploadedUrls.length > 0) {
            await Promise.allSettled(uploadedUrls.map(deleteFromCloudinary));
        }
        const errorMessage = error.message || "Unknown error";
        throw new ApiError(500, `Database error: ${errorMessage}`);
    }
});

export const getProduct = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) {
        throw new ApiError(400, "ID is required");
    }

    const product = await Product.findById(id);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    return ApiResponse(res, 200, "Product retrieved successfully", product);
});

export const getAllProducts = asyncHandler(async(req: Request, res: Response) => {
    const products = await Product.find();
    if(products.length === 0) throw new ApiError(404, "No products found");
    return ApiResponse(res, 200, "Products retrieved successfully", products);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) throw new ApiError(400, "ID is required");

    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new ApiError(404, "Product not found");

    const imageUrls = product.variants.map(v => v.variantImage);
    await Promise.allSettled(imageUrls.map(deleteFromCloudinary));

    return ApiResponse(res, 200, "Product deleted successfully", product);
});