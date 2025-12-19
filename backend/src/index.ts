import dotenv from "dotenv";
dotenv.config();

import connectDB from "./db/db.js";
import app from "./app.js";

(async (): Promise<void> => {
    try {
        await connectDB();
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on Port: ${process.env.PORT || 5000}`);
        });
    } catch (err) {
        console.error(err); // Debug log
        process.exit(1);
    }
})();