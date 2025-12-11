import mongoose from "mongoose";

const whyUsSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: [true, "Heading is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
    }
});

const whatOurClientsSaySchema = new mongoose.Schema({
    nameOfClient: {
        type: String,
        required: [true, "Client name is required"]
    },
    roleOfClient: {
        type: String
    },
    quotesOfClient: {
        type: String,
        required: [true, "Quotes are required"],
    }
});

const homeSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            default: "homePage"
        },
        tagline: {
            type: String,
            required: [true, "Tagline is required"]
        },
        heroImage: {
            type: String,
            required: [true, "Hero Image is required"]
        },
        whyUs: {
            type: [whyUsSchema],
            required: [true, "Features are required"],
            validate: {
                validator: function(arr: any[]) {
                    return arr.length === 3;
                },
                message: "Exactly 3 features are required"
            }
        },
        ourStoryShort: {
            type: String,
            required: [true, "Our story (short) is required"],
        },
        whatOurClientsSay: {
            type: [whatOurClientsSaySchema],
            required: [true, "Testimonials are required"],
            validate: {
                validator: function(arr: any[]) {
                    return arr.length === 3;
                },
                message: "Exactly 3 testimonials are required"
            }
        }
    },
    {
        timestamps: true
    }
);

export const Home = mongoose.model("Home", homeSchema);