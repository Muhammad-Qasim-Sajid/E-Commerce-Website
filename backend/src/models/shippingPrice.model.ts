import mongoose from "mongoose";

const shippingPriceSchema  = new mongoose.Schema({
    shippingPrice: {
        type: Number,
        required: [true, "Shipping price is required"],
        min: [0, "Shipping Price cannot be negative"]
    }
});

export const ShippingPrice = mongoose.model("ShippingPrice", shippingPriceSchema);