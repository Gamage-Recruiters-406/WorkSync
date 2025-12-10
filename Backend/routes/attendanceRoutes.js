import express from "express";
import { 
    clockInController,
    clockOutController, 
    getAttendanceController 
    
} from "../controllers/attendanceController.js";

const router = express.Router();

// POST: Create new attendance
router.post("/clock-in", clockInController);

// PUT: Update attendance (Clock Out)
router.put("/clock-out", clockOutController);

// GET: Read all attendance
router.get("/get-all", getAttendanceController);

export default router;