import express from "express";
import { clockInController, getAttendanceController } from "../controllers/attendanceController.js";

// router object
const router = express.Router();

// CREATE || CLOCK IN
router.post("/clock-in", clockInController);

// READ || GET ALL ATTENDANCE
router.get("/get-all", getAttendanceController);

export default router;