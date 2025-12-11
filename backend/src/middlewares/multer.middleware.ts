import multer from "multer";

const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, "./public/temp"),
    filename: (_, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e6);
        cb(null, `${file.fieldname}-${uniqueSuffix}`);
    }
});

const upload = multer({ storage });

export default upload;