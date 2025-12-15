import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    variantName: {
        type: String,
        required: [true, "Variant name is required"]
    },
    variantImage: {
        type: String,
        required: [true, "Variant image is required"]
    },
    variantPrice: {
        type: Number,
        required: [true, "Variant price is required"]
    },
    variantPreviousPrice: {
        type: Number,
        validate: {
            validator: function(this: any, value: number) {
                if (value !== undefined && value !== null) {
                    return value > this.variantPrice;
                }
                return true; // skip validation if not provided
            },
            message: "Variant previous price must be greater than variant price"
        }
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
        featuredProduct: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const Product = mongoose.model("Product", productSchema);