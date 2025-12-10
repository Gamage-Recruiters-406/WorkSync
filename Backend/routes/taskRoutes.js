import express from "express";
import {
    createTask,
    deleteTask,
} from "../controllers/taskController.js";
import {requiredSignIn} from "../middlewares/AuthMiddleware.js";


const router = express.Router();

// CREATE TASK
router.post("/createTask", requiredSignIn, createTask);      // POST /api/tasks/
//router.post("/createTask", createTask);      // POST /api/v1/task/createTask
// DELETE TASK
router.delete("/deleteTask/:id", requiredSignIn, deleteTask);
//router.delete("/deleteTask/:id", deleteTask);  // DELETE /api/v1/task/deleteTask/:id


export default router;
