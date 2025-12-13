import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"]
        },
        email: {
            type: String,
            required: [true, "Email is required"]
        },
        subject: {
            type: String,
            required: [true, "Subject is required"]
        },
        message: {
            type: String,
            required: [true, "Message is required"]
        },
        read: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

contactSchema.index({ createdAt: -1 });
contactSchema.index({ read: 1, createdAt: -1 });

export const Contact = mongoose.model("Contact", contactSchema);