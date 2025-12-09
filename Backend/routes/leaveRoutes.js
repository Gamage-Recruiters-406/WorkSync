import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  createLeaveRequest,
  deleteLeaveRequest,
} from "../controllers/leaveController.js";

const router = express.Router();

// Validation middleware
const validateLeaveRequest = (req, res, next) => {
  const { leaveType, reason, startDate, endDate } = req.body;
  const errors = [];

  // Validate required fields
  if (!leaveType) errors.push("leaveType is required");
  if (!reason || reason.length < 10) {
    errors.push("Reason must be at least 10 characters");
  }
  if (!startDate) errors.push("startDate is required");
  if (!endDate) errors.push("endDate is required");

  // Validate date logic
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date.",
      });
    }
  }

  // Return validation errors if any
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

// All routes are protected with JWT
router.use(verifyToken);

// POST /api/v1/leave-request/addLeave - Create new leave request
router.post("/addLeave", validateLeaveRequest, createLeaveRequest);

// DELETE /api/v1/leave-request/deleteLeave/:id - Delete leave request
router.delete("/deleteLeave/:id", deleteLeaveRequest);

export default router;
