import express from "express";
import {requiredSignIn} from "../middlewares/AuthMiddleware.js";
import {
  createLeaveRequest,
  deleteLeaveRequest,
} from "../controllers/leaveController.js";

const router = express.Router();

//All routes are protected with JWT
router.use(requiredSignIn);

router.use(express.json());

// POST /api/v1/leave-request/addLeave - Create new leave request
router.post("/addLeave", createLeaveRequest);

// DELETE /api/v1/leave-request/deleteLeave/:id - Delete leave request
router.delete("/deleteLeave/:id", deleteLeaveRequest);

export default router;
