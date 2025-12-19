import express from "express";
import {requiredSignIn, isManagerOrAdmin} from "../middlewares/AuthMiddleware.js";
import {
  createLeaveRequest,
  deleteLeaveRequest,
  updateLeaveRequest,
  updateLeaveStatus,
  getLeavesByUser,
  getSingleLeave,
  getAllLeaves
} from "../controllers/leaveController.js";

const router = express.Router();

//All routes are protected with JWT
router.use(requiredSignIn);

router.use(express.json());

// POST /api/v1/leave-request/addLeave - Create new leave request
router.post("/addLeave", createLeaveRequest);

// Update leave details (requester only)
router.put("/updateLeave/:id", updateLeaveRequest);

// Approve / Reject / Pending (Manager/Admin only)
router.patch(
  "/updateLeaveStatus/:id",
  isManagerOrAdmin,
  updateLeaveStatus
);

// Employee routes
router.get("/getLeave/:uid", getLeavesByUser);
router.get("/getUserLeave/:id", getSingleLeave);

// Manager / Admin routes
router.get("/getAllLeaves", isManagerOrAdmin, getAllLeaves);

// DELETE /api/v1/leave-request/deleteLeave/:id - Delete leave request
router.delete("/deleteLeave/:id", deleteLeaveRequest);

export default router;
