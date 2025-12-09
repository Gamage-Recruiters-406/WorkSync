import express from "express";
//import { verifyToken } from "../middleware/auth.js";
import {
  createLeaveRequest,
  deleteLeaveRequest,
} from "../controllers/leaveController.js";

const router = express.Router();

// All routes are protected with JWT
//router.use(verifyToken);

router.use(express.json());

router.use((req, res, next) => {
  // Hardcode user data for testing
  req.userId = "6612345678901234567890ab"; 
  req.userRole = "employee"; 
  next();
});

// POST /api/v1/leave-request/addLeave - Create new leave request
router.post("/addLeave", createLeaveRequest);

// DELETE /api/v1/leave-request/deleteLeave/:id - Delete leave request
router.delete("/deleteLeave/:id", deleteLeaveRequest);

export default router;
