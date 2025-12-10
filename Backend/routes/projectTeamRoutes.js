import express from "express";
import {
    addMember,
    getMembers,
    updateMemberRole,
    removeMember,
    getProjectsOfUser
} from "../controllers/projectTeamController.js";

const router = express.Router();

// TEST ROUTE 
router.get("/", (req, res) => {
    res.send("Project Team API Working");
});

// Add member
router.post("/addMember", addMember);

// Get all members of a project
router.get("/getMembers/:pid", getMembers);

// Update member role
router.put("/updateMemberRole/:id", updateMemberRole);

// Remove member
router.delete("/removeMember/:id", removeMember);

// Get all projects of a user
router.get("/getProjects/:uid", getProjectsOfUser);

export default router;
