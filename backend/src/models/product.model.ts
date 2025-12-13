import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    variantName: {
        type: String,
        required: [true, "Variant name is required"]
    },
    variantImage: {
        type: String, // One variant have one image only
        required: [true, "Variant image is required"]
    },
    variantPrice: {
        type: Number // It is not required cuzz if it is not present then general price will be considered
    },
    variantPreviousPrice: {
        type: Number // This will only be used if variant price is given to calculate the discount on variant
    },
    variantOrder: { 
        type: Number, 
        required: [true, "Variant order is required"]
    },
    variantStock: {
        type: Number,
        required: [true, "Variant stock is required"]
    }
});

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        variants: {
            type: [variantSchema],
            validate: {
                validator: function (arr: any[]) {
                    return arr.length > 0;
                },
                message: "At least 1 variant is required"
            }
        },
        smallDescription: {
            type: String,
            required: [true, "Small description is required"],
            maxlength: [100, "Small description should not exceed 100 characters"]
        },
        longDescription: {
            type: String,
            required: [true, "Long description is required"],
            minlength: [300, "Long description should be greater 300 characters"]
        },
        generalPrice: {
            type: Number,
            required: [true, "General price is required"],
        },
        previousGeneralPrice: {
            type: Number // Only add this while giving discount cuzz it will be used to show discounted price on frontend (This message will be displayed on frontend)
        },
        featuredProduct: {
            type: Boolean, // First 5 featured products will be shown on home page
            default: false
        }
        // Total stock will be calculated by adding variant stocks on frontend 
    },
    {
        timestamps: true 
    }
);

export const Product = mongoose.model("Product", productSchema);