import express from "express";
import {
    addMember,
    getMembers,
    updateMemberRole,
    removeMember,
    getProjectsOfUser
} from "../controllers/projectTeamController.js";

import { 
    requiredSignIn,
    isManagerOrAdmin
} from "../middlewares/AuthMiddleware.js";

const router = express.Router();

// TEST ROUTE
router.get("/", (req, res) => {
    res.send("Project Team API Working");
});

/* ---------------------------
   ROUTES WITH VALIDATION
   Only Manager or Admin can:
   - Add Member
   - Update Member Role
   - Remove Member
---------------------------- */

// Add member (Manager/Admin ONLY)
router.post("/addMember", requiredSignIn, isManagerOrAdmin, addMember);

// Update member role (Manager/Admin ONLY)
router.put("/updateMemberRole", requiredSignIn, isManagerOrAdmin, updateMemberRole);

// Remove member (Manager/Admin ONLY)
router.delete("/removeMember", requiredSignIn, isManagerOrAdmin, removeMember);

/* ---------------------------
 VIEW ROUTES (Employees allowed)
   Anyone logged in (employees, managers, admin) can:
   - View team members
   - View projects of user
---------------------------- */

// Get team members (visible to employees)
router.get("/getMembers/:pid", requiredSignIn, getMembers);

// Get projects of a user
router.get("/getProjects/:uid", requiredSignIn, getProjectsOfUser);

export default router;
