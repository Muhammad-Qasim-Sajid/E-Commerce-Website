import fs from "fs";

export const cleanupFile = (file?: Express.Multer.File): void => {
    if(!file) return;
    if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
    }
};

export const cleanupFiles = (files?: Express.Multer.File[]): void => {
    if (!files) return;
    for (const file of files) {
        if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
    }
};