import express from "express";
import mongoose from "mongoose";
import {
    createTask,
    deleteTask,
    updateTask,
    getAllTasks,
    getAllUserTasks,
    updateTaskStatus,
    markDone,
    inProgress,
    filterProjectTasks,
    getTasksByProject
} from "../controllers/taskController.js";
import { requiredSignIn, isEmployee, isAdmin } from "../middlewares/AuthMiddleware.js";
import { createDiskUploader } from "../middlewares/uploadFactory.js";

const router = express.Router();

// For createTask with attachments: generate task id before multer decides folder
const prepareCreateTask = (req, res, next) => {
    req.generatedTaskId = new mongoose.Types.ObjectId();
    next();
};

const createTaskUploader = createDiskUploader({
    getDestination: (req) => `uploads/tasks/${req.generatedTaskId?.toString?.() || "unknown"}`,
    maxFileSizeMB: 10,
});

// CREATE TASK
router.post("/createTask",requiredSignIn,isEmployee,prepareCreateTask,createTaskUploader.array("attachments", 5),createTask);

// UPDATE TASK
router.put("/updateTask/:id", requiredSignIn, isEmployee, updateTask);

// DELETE TASK
router.delete("/deleteTask/:id", requiredSignIn, isEmployee, deleteTask);

// GET ALL USER TASKS
router.get("/getAllTasks", requiredSignIn, isAdmin, getAllTasks);
// GET SINGLE TASK
router.get("/getAllUserTasks/:id", requiredSignIn, isEmployee, getAllUserTasks);


// UPDATE STATUS
router.patch("/updateStatus/:id", requiredSignIn, isEmployee, updateTaskStatus);

// MARK TASK AS DONE
router.patch("/markDone/:id", requiredSignIn, isEmployee, markDone);

// IN PROGRESS TASKS DONE
router.patch("/inProgress/:id", requiredSignIn, isEmployee, inProgress);

// GET TASKS BY PROJECT
router.get("/project/:projectId", requiredSignIn, isEmployee, getTasksByProject);

// FILTER PROJECT TASKS
router.get("/project/:projectId/filter", requiredSignIn, isEmployee, filterProjectTasks);

export default router;
