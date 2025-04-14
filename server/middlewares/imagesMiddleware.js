import multer from "multer";
import path from "path";
import fs from "fs";

// 🔹 Define and ensure the 'images' directory exists
const uploadDir = path.join(process.cwd(), "images"); // ✅ More robust path handling
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 🔹 Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // ✅ Save images in the 'images' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`); // ✅ Unique filename
  },
});

// 🔹 Allowed image formats
const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

// 🔹 File filter to accept only image files
const fileFilter = (req, file, cb) => {
  allowedMimeTypes.includes(file.mimetype)
    ? cb(null, true) // ✅ Accept file
    : cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed."), false);
};

// 🔹 Multer upload instance with file size limit (5MB)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // ✅ 5MB limit
}).single("image"); // ✅ Handles single file upload

// 🔹 Middleware wrapper to handle errors gracefully
const uploadMiddleware = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "File upload error" });
    }
    next();
  });
};

export default uploadMiddleware;
