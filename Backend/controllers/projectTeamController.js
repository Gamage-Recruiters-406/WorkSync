import ProjectTeam from "../models/ProjectTeam.js";
import mongoose from "mongoose";

// ADD MEMBER TO PROJECT
export const addMember = async (req, res) => {
    try {
        const { projectId, userId, assignedRole } = req.body;

        // Validate required fields
        if (!projectId || !userId || !assignedRole) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Prevent duplicate member
        const existingMember = await ProjectTeam.findOne({ projectId, userId });
        if (existingMember) {
            return res.status(400).json({ message: "User already added to this project" });
        }

        // Create new member
        const newMember = new ProjectTeam({
            projectId,
            userId,
            assignedRole
        });

        const saved = await newMember.save();
        res.status(201).json(saved);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL MEMBERS OF A PROJECT
export const getMembers = async (req, res) => {
    try {
        const { pid } = req.params;
        const members = await ProjectTeam.find({ projectId: pid });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE MEMBER ROLE
export const updateMemberRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedRole } = req.body;

        if (!assignedRole) {
            return res.status(400).json({ message: "assignedRole is required" });
        }

        const updated = await ProjectTeam.findByIdAndUpdate(
            id,
            { assignedRole },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.status(200).json(updated);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// REMOVE MEMBER FROM PROJECT
export const removeMember = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await ProjectTeam.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Member not found" });
        }

        res.status(200).json({
            message: "Member removed successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL PROJECTS OF A USER
export const getProjectsOfUser = async (req, res) => {
    try {
        const { uid } = req.params;

        const projects = await ProjectTeam.find({ userId: uid });
        res.status(200).json(projects);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
