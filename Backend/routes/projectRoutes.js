import express from 'express';
import { createProjectController, getSingleProjectController, getAllProjectsController, updateProjectController, deleteProjectController } from '../controllers/projectController.js';
import { requiredSignIn, isManagerOrAdmin } from '../middlewares/AuthMiddleware.js';

// router object
const router = express.Router();

// CREATE PROJECT -> POST /api/v1/projects/createProject
router.post("/createProject", requiredSignIn, isManagerOrAdmin, createProjectController);

// GET SINGLE PROJECT -> GET /api/v1/projects/getProject/:id
router.get("/getProject/:id", requiredSignIn, isManagerOrAdmin, getSingleProjectController);

// GET ALL PROJECTS -> GET /api/v1/projects/getAllProjects
router.get("/getAllProjects", requiredSignIn, isManagerOrAdmin, getAllProjectsController);

// UPDATE PROJECT -> PUT /api/v1/projects/updateProject/:id
router.put("/updateProject/:id", requiredSignIn, isManagerOrAdmin, updateProjectController);

// DELETE PROJECT -> DELETE /api/v1/projects/deleteProject/:id
router.delete("/deleteProject/:id", requiredSignIn, isManagerOrAdmin, deleteProjectController);

export default router;