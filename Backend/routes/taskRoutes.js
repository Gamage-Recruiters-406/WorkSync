import express from "express";
import {
    createTask,
    deleteTask,
    updateTask,
} from "../controllers/taskController.js";
import {
    requiredSignIn,
    isEmployee  // Import normal employee middleware
} from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// CREATE TASK - Only for Special Employee
router.post("/createTask", requiredSignIn, isEmployee, createTask);

// UPDATE TASK - Only for Special Employee (full update)
router.put("/updateTask/:id", requiredSignIn, isEmployee, updateTask);


// DELETE TASK - Only for Special Employee
router.delete("/deleteTask/:id", requiredSignIn, isEmployee, deleteTask);

export default router;