import express from "express";
import { 
    clockInController, 
    clockOutController,
    getAttendanceController     
} from "../controllers/attendanceController.js";


import { requiredSignIn, isAdmin } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// ROUTE 1: CLOCK IN
router.post("/clock-in", requiredSignIn, clockInController);

// ROUTE 2: CLOCK OUT
router.put("/clock-out", requiredSignIn, clockOutController);

// ROUTE 3: GET ALL (User MUST be logged in AND be an Admin (Role 3) to see this.)
router.get("/get-all", requiredSignIn, isAdmin, getAttendanceController);

export default router;