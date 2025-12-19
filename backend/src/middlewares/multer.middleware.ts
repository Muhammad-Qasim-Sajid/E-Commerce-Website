import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, "./public/temp"),
    filename: (_, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});
const fileFilter: multer.Options["fileFilter"] = (_, file, cb) => {
    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        cb(new Error("Only JPG, JPEG, PNG, and WEBP images are allowed"));
        return;
    }

    cb(null, true);
};

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 }, fileFilter });

export default upload;