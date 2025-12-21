import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must be at least 8 characters'),
});
export type AdminLoginData = z.infer<typeof adminLoginSchema>;



const whyUsItemSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  description: z.string().min(1, "Description is required"),
});
const whatOurClientsSaySchema = z.object({
  nameOfClient: z.string().min(1, "Client name is required"),
  roleOfClient: z.string().optional(),
  quotesOfClient: z.string().min(1, "Quotes are required"),
});
export const homePageSchema = z.object({
  _id: z.string(),
  tagline: z.string().min(1, "Tagline is required"),
  heroImage: z.string().min(1, "Hero image is required"),
  ourStoryShort: z.string().min(1, "Our story is required"),
  whyUs: z.array(whyUsItemSchema).length(3, "Exactly 3 features are required"),
  whatOurClientsSay: z.array(whatOurClientsSaySchema).length(3, "Exactly 3 testimonials are required"),
});
export type HomeData = z.infer<typeof homePageSchema>;



const founderQuotesSchema = z.object({
  founderName: z.string().min(1, "Founder name is required"),
  quotesOfFounder: z.string().min(1, "Founder quotes are required")
});
const headParaSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  paragraph: z.string().min(1, "Paragraph is required")
});
export const ourStorySchema = z.object({
  _id: z.string(),
  tagline: z.string().min(1, "Tagline is required"),
  founderQuotes: founderQuotesSchema,
  headPara: z.array(headParaSchema).min(3, "At least 3 story sections are required")
});
export type OurStoryData = z.infer<typeof ourStorySchema>;



const faqItemSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required")
});
export const faqsSchema = z.object({
  _id: z.string(),
  faqs: z.array(faqItemSchema).min(1, "At least 1 FAQ is required")
});
export type FAQsData = z.infer<typeof faqsSchema>;



const variantSchema = z.object({
  variantName: z.string().min(1, "Variant name is required"),
  variantPrice: z.coerce.number().min(1, "Variant price is required"),
  variantPreviousPrice: z.coerce.number().optional(),
  variantOrder: z.coerce.number().int().min(1, "Variant order is required"),
  variantStock: z.coerce.number().int().min(0, "Variant stock cannot be negative"),
}).refine(
  (data) => {
    if (data.variantPreviousPrice && data.variantPrice) {
      return data.variantPreviousPrice > data.variantPrice;
    }
    return true;
  },
  {
    message: "Variant previous price must be greater than variant price",
    path: ["variantPreviousPrice"],
  }
);
export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  smallDescription: z.string()
    .min(1, "Small description is required")
    .max(100, "Small description should not exceed 100 characters"),
  longDescription: z.string()
    .min(300, "Long description should be at least 300 characters"),
  featuredProduct: z.boolean().default(false),
  variants: z.array(variantSchema).min(1, "At least 1 variant is required"),
});