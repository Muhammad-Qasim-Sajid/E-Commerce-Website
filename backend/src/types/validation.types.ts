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



// Contact Validations
export const contactPageSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    subject: z.string().min(1, "Subject is required"),
    message: z.string().min(1, "Message is required")
});



// Product Validations
export const variantSchema = z.object({
    variantName: z.string().min(1, "Variant name is required"),
    variantPrice: z.number().min(1, "Variant price is required"),
    variantPreviousPrice: z.number().min(0).optional(),
    variantOrder: z.number().int().min(1, "Variant order is required"),
    variantStock: z.number().int().min(0, "Variant stock cannot be negative"),
}).refine(
    (data) => data.variantPreviousPrice === undefined || data.variantPreviousPrice > data.variantPrice,
    {
        message: "Previous variant price must be greater than variant price",
        path: ["variantPreviousPrice"],
    }
);

export const productPageSchema = z.object({
    name: z.string().min(1, "Name is required"),
    variants: z
        .array(variantSchema)
        .min(1, "At least 1 variant is required"),
    smallDescription: z.string()
        .min(1, "Small description is required")
        .max(100, "Small description should not exceed 100 characters"),
    longDescription: z.string()
        .min(300, "Long description should be at least 300 characters"),
    featuredProduct: z.boolean().default(false)
});



// Order Validations
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");
export const orderItemsSchema = z.object({
    productId: objectId,
    variantId: objectId,
    quantity: z.number().int().min(1, "Quantity is required"),
});

export const orderPageSchema = z.object({
    customerName: z.string().min(1, "Customer name is required"),
    customerEmail: z.string().email("Invalid email"),
    customerPhone: z.string().min(7, "Customer phone is required"),
    customerAddress: z.string().min(10, "Customer address is required"),
    items: z
        .array(orderItemsSchema)
        .min(1, "At least 1 item is required"),
});