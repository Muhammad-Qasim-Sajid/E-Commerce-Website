import mongoose from "mongoose";

const faqItemSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    answer: {
        type: String,
        required: [true, "Answer is required"]
    }
});

const faqSchema = new mongoose.Schema({
    faqs: {
        type: [faqItemSchema],
        validate: {
            validator: function (arr: any[]) {
                return arr.length > 0;
            },
            message: "At least 1 FAQ is required"
        }
    }
});

export const FAQs = mongoose.model("FAQs", faqSchema);