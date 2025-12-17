import express from "express";
import { 
    clockInController, 
    clockOutController,
    getAttendanceController,
    getSingleUserAttendanceController,
    generateAttendanceReport,
    updateAttendanceController,
    requestCorrectionController,
    getPendingCorrectionsController,
    approveCorrectionController
} from "../controllers/attendanceController.js";

import { requiredSignIn, isManagerOrAdmin } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// Add attendance
router.post("/startAttendent", requiredSignIn, clockInController);

// Get Attendance (admin) 
router.get("/getAttendent", requiredSignIn, getAttendanceController);

// Get single user attendance 
router.get("/get-single-user-attendance/:id", requiredSignIn, isManagerOrAdmin, getSingleUserAttendanceController);

// Check out attendance 
router.patch("/EndAttendance/:id", requiredSignIn, clockOutController);

// Generate attendance report 
router.get("/attendanceReport", requiredSignIn, isManagerOrAdmin, generateAttendanceReport);

// Manual Admin Update (Fix mistakes Admin Full Access)
router.put("/update/:attendanceId", requiredSignIn, isManagerOrAdmin, updateAttendanceController);

// Employee Request Correction 
router.post("/request-correction", requiredSignIn, requestCorrectionController);

// Admin Get Pending Requests 
router.get("/pending-corrections", requiredSignIn, isManagerOrAdmin, getPendingCorrectionsController);

// Admin Approve/Reject 
router.post("/approve-correction", requiredSignIn, isManagerOrAdmin, approveCorrectionController);

export default router;