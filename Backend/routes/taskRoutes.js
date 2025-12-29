import express from "express";
import {
    createTask,
    deleteTask,
} from "../controllers/taskController.js";
import {isManager, requiredSignIn} from "../middlewares/AuthMiddleware.js";


const router = express.Router();

// CREATE TASK
router.post("/createTask", requiredSignIn,isManager, createTask);      // POST /api/tasks/
//router.post("/createTask", createTask);      // POST /api/v1/task/createTask
// DELETE TASK
router.delete("/deleteTask/:id", requiredSignIn,isManager, deleteTask);
//router.delete("/deleteTask/:id", deleteTask);  // DELETE /api/v1/task/deleteTask/:id


export default router;
