import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Data_Limit } from "./constants.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.middleware.js";

const app = express();

// Middleawres
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Will set CORS_ORIGIN later
    credentials: true
}));
app.use(express.json({limit: `${Data_Limit}`}));
app.use(express.urlencoded({extended: true, limit: `${Data_Limit}`}));
app.use(express.static("public"));

// Router imports
import homeRouter from "./routes/home.routes.js";
import ourStoryRouter from "./routes/ourStory.route.js";
import faqsRouter from "./routes/faqs.routes.js";
import contactRouter from "./routes/contact.routes.js";
import productRouter from "./routes/product.routes.js";
import shippingPriceRouter from "./routes/shippingPrice.routes.js";
import orderRouter from "./routes/order.routes.js";

// Routes declaration
app.use("/api/v1", homeRouter);
app.use("/api/v1/our-story", ourStoryRouter);
app.use("/api/v1/faqs", faqsRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/shipping-price", shippingPriceRouter);
app.use("/api/v1/order", orderRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;