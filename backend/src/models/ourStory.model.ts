import mongoose from "mongoose";

const founderQuotesSchema = new mongoose.Schema({
    founderName: {
        type: String,
        required: [true, "Founder name is required"]
    },
    quotesOfFounder: {
        type: String,
        required: [true, "Quotes are required"]
    },
});
const headParaSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: [true, "Heading is required"],
    },
    paragraph: {
        type: String,
        required: [true, "Paragraph is required"],
    }
});

const ourStorySchema = new mongoose.Schema(
    {
        tagline: {
            type: String,
            required: [true, "Tagline is required"],
        },
        founderQuotes: founderQuotesSchema,
        headPara: {
            type: [headParaSchema],
            validate: {
                validator: function (arr: any[]) {
                    return arr.length >= 3;
                },
                message: "At least 3 story sections are required"
            }
        }
    }
);

export const OurStory = mongoose.model("OurStory", ourStorySchema);