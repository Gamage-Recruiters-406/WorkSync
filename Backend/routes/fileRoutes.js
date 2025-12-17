import express from "express";
import {
  upload,
  handleFileUpload,
} from "../middlewares/fileUploadMiddleware.js";
import {
  uploadFile,
  downloadFile,
  updateFile,
  deleteFile,
} from "../controllers/fileController.js";

const router = express.Router();

// Routes
router.post("/upload", upload.single("file"), handleFileUpload, uploadFile);
router.get("/download/:id", downloadFile);
router.put("/update/:id", upload.single("file"), updateFile);
router.delete("/delete/:id", deleteFile);

export default router;
