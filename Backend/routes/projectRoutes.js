import express from 'express';
import { createProjectController, deleteProjectController } from '../controllers/projectController.js';
import { requiredSignIn, isManagerOrAdmin } from '../middlewares/AuthMiddleware.js';

// router object
const router = express.Router();

// CREATE PROJECT -> POST /api/v1/projects/createProject
router.post("/createProject", requiredSignIn, isManagerOrAdmin, createProjectController);

// DELETE PROJECT -> DELETE /api/v1/projects/deleteProject/:id
router.delete("/deleteProject/:id", requiredSignIn, isManagerOrAdmin, deleteProjectController);

export default router;