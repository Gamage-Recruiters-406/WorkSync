import express from "express";
import { 
    clockInController, 
    clockOutController,
    getAttendanceController,
    exportAttendanceExcel, 
    exportAttendancePDF,
    updateAttendanceController    
} from "../controllers/attendanceController.js";


import { requiredSignIn, isManagerOrAdmin } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// CHECK IN TIME
router.post("/clock-in", requiredSignIn, clockInController);

// CHECK OUT TIME
router.put("/clock-out", requiredSignIn, clockOutController);

// GET ALL RECORDS (Attendance logs)
router.get("/get-all", requiredSignIn, getAttendanceController);

// Attendance Corrections
router.put("/update/:attendanceId", requiredSignIn, isManagerOrAdmin, updateAttendanceController);

// Download Excel Report
router.get("/export/excel", requiredSignIn, isManagerOrAdmin, exportAttendanceExcel);

// Download PDF Report
router.get("/export/pdf", requiredSignIn, isManagerOrAdmin, exportAttendancePDF);

export default router;