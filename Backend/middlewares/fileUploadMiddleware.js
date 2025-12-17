import multer from "multer";
import fs from "fs";
import path from "path";
import File from "../models/File.js";

// Multer Config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage: storage });

export const uploadSingleFile = upload.single("file");

// Middleware to save file to DB
export const handleFileUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const { filename, originalname, path, mimetype, size } = req.file;

    const file = new File({
      filename,
      originalName: originalname,
      path,
      mimetype,
      size,
    });

    await file.save();

    // Attach saved file to request for easy access in controllers
    req.uploadedFile = file;

    next();
  } catch (error) {
    console.error("Error in handleFileUpload middleware:", error);
    res.status(500).send({
      message: "Error processing file upload",
      error,
    });
  }
};
