import multer from "multer";

const storage = multer.memoryStorage();

// allow only pdf + images
const fileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/jpg"
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF and images are allowed."), false);
  }
};

export const uploadProjectFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});