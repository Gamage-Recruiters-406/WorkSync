import express from "express";
import { 
    createMilestone,
    getAllMilestones,
    getMilestone,
    getMilestoneDetails,
    updateMilestone,
    updateMilestoneStatus,
    deleteMilestone
} from "../controllers/milestoneController.js"

//create route object 
const router = express.Router();

const { protect, authorize } = require('../middleware/authMiddleware');

// Create Milestone (Admin/Manager only)
router.post('/createMilestone', protect, authorize('admin', 'manager'), createMilestone);

// Get all milestones
router.get('/getAllMilestones/:pid', protect, getAllMilestones);

// Get single milestone
router.get('/getMilestone/:id', protect, getMilestone);

// Get milestone details
router.get('/getMilestoneDetails/:id', protect, getMilestoneDetails);

// Update milestones (Admin/Manager only)
router.put('/updateMilestone/:id', protect, authorize('admin', 'manager'), updateMilestone);

// Update milestone status (All authenticated users)
router.patch('/updateMilestoneStatus/:id', protect, updateMilestoneStatus);

// Delete milestone (Admin/Manager only)
router.delete('/deleteMilestone/:id', protect, authorize('admin', 'manager'), deleteMilestone);

export default router;