import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

// User Registration - POST /api/v1/userAuth/userRegistration
router.post("/userRegistration", registerUser);

// User Login - POST /api/v1/userAuth/userLogin
router.post("/userLogin", loginUser);

export default router;
