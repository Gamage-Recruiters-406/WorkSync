import express from 'express';
import { createProjectController } from '../controllers/projectController.js';
import { requiredSignIn, isManagerOrAdmin } from '../middlewares/authMiddleware.js';

// router object
const router = express.Router();

// CREATE PROJECT -> POST /api/v1/projects/createProject
router.post("/createProject", requiredSignIn, isManagerOrAdmin, createProjectController);

export default router;