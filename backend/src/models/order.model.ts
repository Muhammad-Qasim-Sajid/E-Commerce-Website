import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: [true, "Name is required"]
        },
        customerEmail: {
            type: String,
            required: [true, "Email is required"]
        },
        customerPhone: {
            type: String,
            required: [true, "Phone is required"]
        },
        customerAddress: {
            type: String,
            required: [true, "Address is required"]
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                variantId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true
                },
                variantSnapshot: {
                    name: { 
                        type: String, 
                        required: true 
                    },
                    price: { 
                        type: Number, 
                        required: true 
                    },
                    image: { 
                        type: String, 
                        required: true 
                    }
                },
                quantity: {
                    type: Number,
                    required: true
                },
                totalPrice: {
                    type: Number,
                    required: true
                }
            }
        ],
        shippingPrice: {
            type: Number,
            required: [true, "Shipping price is required"]
        },
        totalPrice: {
            type: Number,
            required: [true, "Total price is required"]
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },
        orderStatus: {
            type: String,
            enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
            default: "Processing",
        },
        shippingTrackingNumber: {
            type: String,
        },
        trackingToken: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true 
    }
);

orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model("Order", orderSchema);