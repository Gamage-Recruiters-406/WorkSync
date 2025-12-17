import express from "express";
import {createMilestone} from "../controllers/milestoneController.js"

//create route object 
const router = express.Router();

router.post("/addMilestone", createMilestone);


export default router;