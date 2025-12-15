import express from "express";
import { 
    clockInController, 
    clockOutController,
    getAttendanceController     
} from "../controllers/attendanceController.js";


import { requiredSignIn } from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// CHECK IN TIME
router.post("/clock-in", requiredSignIn, clockInController);

//  CHECK OUT TIME
router.put("/clock-out", requiredSignIn, clockOutController);

//  GET ALL RECODERS
router.get("/get-all", requiredSignIn, getAttendanceController);

export default router;