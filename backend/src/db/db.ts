import mongoose from "mongoose";
import { DB_Name } from "../constants.js";

const connectDB = async (): Promise<void> => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_Name}`);
        console.log("Connection Instance:", connectionInstance.connection.host); // Debug log
    } catch (error) {
        throw error;
    }
};

export default connectDB;