import express from "express";
import { 
    createMilestone,
    getAllMilestones,
    getMilestone,
    getMilestoneDetails,
    updateMilestone,
    updateMilestoneStatus,
    deleteMilestone
} from "../controllers/milestoneController.js";

//create route object 
const router = express.Router();

import { requiredSignIn, isEmployee } from '../middlewares/AuthMiddleware.js';

// Create Milestone (Admin/Manager only)
router.post('/createMilestone', requiredSignIn, isEmployee, createMilestone);

// Get all milestones
router.get('/getAllMilestones/:pid', requiredSignIn, getAllMilestones);

// Get single milestone
router.get('/getMilestone/:id', requiredSignIn, getMilestone);

// Get milestone details
router.get('/getMilestoneDetails/:id', requiredSignIn, getMilestoneDetails);

// Update milestones (Admin/Manager only)
router.put('/updateMilestone/:id', requiredSignIn, isEmployee, updateMilestone);

// Update milestone status (All authenticated users)
router.patch('/updateMilestoneStatus/:id', requiredSignIn, updateMilestoneStatus);

// Delete milestone (Admin/Manager only)
router.delete('/deleteMilestone/:id', requiredSignIn, isEmployee, deleteMilestone);

export default router;