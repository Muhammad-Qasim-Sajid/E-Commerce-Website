import { z } from "zod";

export const whyUsItemSchema = z.object({
    heading: z.string().min(1, "Heading is required"),
    description: z.string().min(1, "Description is required"),
});

export const whatOurClientsSaySchema = z.object({
    nameOfClient: z.string().min(1, "Client name is required"),
    roleOfClient: z.string().optional(),
    quotesOfClient: z.string().min(1, "Quotes are required"),
});

export const createHomePageSchema = z.object({
    tagline: z.string().min(1, "Tagline is required"),
    ourStoryShort: z.string().min(1, "Our story is required"),
    whyUs: z
        .array(whyUsItemSchema)
        .length(3, "Features must contain exactly 3 items"),
    whatOurClientsSay: z
        .array(whatOurClientsSaySchema)
        .length(3, "Testimonials must contain exactly 3 items"),
});