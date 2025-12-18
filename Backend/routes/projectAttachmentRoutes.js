import express from 'express';
import { requiredSignIn } from './../middlewares/AuthMiddleware.js';
import { addProjectAttachmentController } from '../controllers/projectAttachmentController.js';
import { createDiskUploader } from '../middlewares/uploadFactory.js';

const router = express.Router({ mergeParams: true });

// store per project folder
const uploader = createDiskUploader({
  getDestination: (req) => `uploads/projects/${req.params.projectId}`,
  maxFileSizeMB: 10,
});

// UPLOAD ATTACHMENT TO PROJECT -> POST /api/v1/projects/:projectId/attachments
router.post("/", requiredSignIn, uploader.array("attachments", 5), addProjectAttachmentController);

export default router;