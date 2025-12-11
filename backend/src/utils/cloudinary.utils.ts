import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadOnCloudinary = async (localFilePath: string): Promise<string> => {
    try {
        if(!localFilePath) throw new Error("Local file path is required");
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'image'
        });
        fs.unlinkSync(localFilePath);
        console.log("Response from cloudinary:", response); // Debug log
        return response.secure_url;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log('Error while uploading the file on cloudinary:', error); // Debug log
        throw error;
    }
}

export const deleteFromCloudinary = async (imageUrl: string): Promise<boolean> => {
    try {
        if(!imageUrl) throw new Error("Image URL is required");

        const urlParts = imageUrl.split("/");
        const fileNameWithExtension = urlParts[urlParts.length - 1];
        const publicId = fileNameWithExtension.split(".")[0];

        const result = await cloudinary.uploader.destroy(publicId);

        if (result.result === "ok") {
            console.log("Image deleted from Cloudinary:", publicId); // Debug log
            return true;
        } else {
            console.log("Failed to delete image from Cloudinary:", result); // Debug log
            return false;
        }
    } catch (error: any) {
        console.error("Error deleting image from Cloudinary:", error.message);
        return false;
    }
};