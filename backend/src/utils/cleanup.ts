import fs from "fs";

export const cleanupFile = (file?: Express.Multer.File) => {
    if(!file) return;
    if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
    }
};

export const cleanupFiles = (files?: Express.Multer.File[]) => {
    if (!files) return;
    for (const file of files) {
        if (file.path && fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
    }
};