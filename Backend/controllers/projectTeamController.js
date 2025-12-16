import ProjectTeam from "../models/ProjectTeam.js";
import mongoose from "mongoose";

//  ADD MEMBER
export const addMember = async (req, res) => {
    try {
        const { projectId, userId, assignedRole } = req.body;

        if (!projectId || !userId || !assignedRole) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Prevent duplicate member in the same project
        const existingMember = await ProjectTeam.findOne({ projectId, userId });
        if (existingMember) {
            return res.status(400).json({ message: "User already added to this project" });
        }

        const newMember = new ProjectTeam({ projectId, userId, assignedRole });
        const saved = await newMember.save();

        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  GET ALL MEMBERS OF A PROJECT 
export const getMembers = async (req, res) => {
    try {
        const { pid } = req.params;
        const members = await ProjectTeam.find({ projectId: pid });
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  UPDATE MEMBER ROLE (by projectId + userId) 
export const updateMemberRole = async (req, res) => {
    try {
        const { projectId, userId, assignedRole } = req.body;

        if (!projectId || !userId || !assignedRole) {
            return res.status(400).json({ message: "projectId, userId and assignedRole are required" });
        }

        const updated = await ProjectTeam.findOneAndUpdate(
            { projectId, userId },
            { assignedRole },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Member not found in this project" });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//  REMOVE MEMBER (by projectId + userId)
export const removeMember = async (req, res) => {
    try {
        const { projectId, userId } = req.body;

        if (!projectId || !userId) {
            return res.status(400).json({ message: "projectId and userId are required" });
        }

        const deleted = await ProjectTeam.findOneAndDelete({ projectId, userId });

        if (!deleted) {
            return res.status(404).json({ message: "Member not found in this project" });
        }

        res.status(200).json({ message: "Member removed successfully" });
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
