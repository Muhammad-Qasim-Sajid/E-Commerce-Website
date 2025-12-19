import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { Data_Limit } from "./constants.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.middleware.js";

const app = express();

// Middleawres
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
app.use(express.json({limit: `${Data_Limit}`}));
app.use(express.urlencoded({extended: true, limit: `${Data_Limit}`}));
app.use(express.static("public"));
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    })
);
// contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       imgSrc: ["'self'", "data:", "https:"],
//       connectSrc: ["'self'", process.env.FRONTEND_URL],
//       fontSrc: ["'self'", "https:", "data:"],
//       frameAncestors: ["'none'"],
//       objectSrc: ["'none'"],
//     },
// },
app.use("/api/v1/admin/login", rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use("/api/v1/order/add-order", rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use("/api/v1/order/track-order", rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use("/api/v1/admin", rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
}));
app.use("/api", rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
}));

// Router imports
import homeRouter from "./routes/home.routes.js";
import ourStoryRouter from "./routes/ourStory.route.js";
import faqsRouter from "./routes/faqs.routes.js";
import contactRouter from "./routes/contact.routes.js";
import productRouter from "./routes/product.routes.js";
import shippingPriceRouter from "./routes/shippingPrice.routes.js";
import orderRouter from "./routes/order.routes.js";
import adminRouter from "./routes/admin.routes.js";

// Routes declaration
app.use("/api/v1", homeRouter);
app.use("/api/v1/our-story", ourStoryRouter);
app.use("/api/v1/faqs", faqsRouter);
app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/shipping-price", shippingPriceRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/admin", adminRouter);

// Global error handler
app.use(globalErrorHandler);

export default app;