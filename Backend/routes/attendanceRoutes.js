import express from "express";
import { 
    clockInController, 
    clockOutController,
    getAttendanceController,
    getSingleUserAttendanceController,
    generateAttendanceReport,
    updateAttendanceController
} from "../controllers/attendanceController.js";

import { requiredSignIn, isManagerOrAdmin } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Add attendance
router.post("/startAttendent", requiredSignIn, clockInController);

// Get Attendance (admin) 
router.get("/getAttendent", requiredSignIn, getAttendanceController);

// Get single user attendance 
router.get("/get-single-user-attendance/:id", requiredSignIn, isManagerOrAdmin, getSingleUserAttendanceController);

// 4. Check out attendance 
router.patch("/EndAttendance/:id", requiredSignIn, clockOutController);

// 5. Generate attendance report (GET)
router.get("/attendanceReport", requiredSignIn, isManagerOrAdmin, generateAttendanceReport);


// Manual Admin Update (Fix mistakes)
router.put("/update/:attendanceId", requiredSignIn, isManagerOrAdmin, updateAttendanceController);

export default router;