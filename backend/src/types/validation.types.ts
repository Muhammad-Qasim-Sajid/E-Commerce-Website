import { z } from "zod";

// Home Validations
export const whyUsItemSchema = z.object({
    heading: z.string().min(1, "Heading is required"),
    description: z.string().min(1, "Description is required"),
});

export const whatOurClientsSaySchema = z.object({
    nameOfClient: z.string().min(1, "Client name is required"),
    roleOfClient: z.string().optional(),
    quotesOfClient: z.string().min(1, "Quotes are required"),
});

export const editHomePageSchema = z.object({
    tagline: z.string().min(1, "Tagline is required"),
    ourStoryShort: z.string().min(1, "Our story is required"),
    whyUs: z
        .array(whyUsItemSchema)
        .length(3, "Features must contain exactly 3 items"),
    whatOurClientsSay: z
        .array(whatOurClientsSaySchema)
        .length(3, "Testimonials must contain exactly 3 items"),
});



// Our Story Validations
export const founderQuotesSchema = z.object({
    founderName: z.string().min(1, "Founder name is required"),
    quotesOfFounder: z.string().min(1, "Founder quotes are required")
});

export const headParaSchema = z.object({
    heading: z.string().min(1, "Heading is required"),
    paragraph: z.string().min(1, "Paragraph is required")
});

export const editOurStoryPageSchema = z.object({
    tagline: z.string().min(1, "Tagline is required"),
    founderQuotes: founderQuotesSchema,
    headPara: z
        .array(headParaSchema)
        .min(3, "At least 3 story sections are required")
});



// Faqs Validations
export const faqsItemsSchema = z.object({
    question: z.string().min(1, "Question is required"),
    answer: z.string().min(1, "Answer is required")
});

export const editFaqsPageSchema = z.object({
    faqs: z
        .array(faqsItemsSchema)
        .min(1, "At least 1 FAQ is required")
});