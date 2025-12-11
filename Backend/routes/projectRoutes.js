import express from 'express';
import { createProjectController } from '../controllers/projectController.js';
import { requiredSignIn, isManagerOrAdmin } from '../middlewares/AuthMiddleware.js';
import { uploadProjectFiles } from '../middlewares/uploadMiddleware.js';

// router object
const router = express.Router();

// CREATE PROJECT -> POST /api/v1/projects/createProject
router.post("/createProject", requiredSignIn, isManagerOrAdmin, uploadProjectFiles.array("attachments", 5), createProjectController);

export default router;