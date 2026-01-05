import ProjectTeam from "../models/ProjectTeam.js";
import User from "../models/EmployeeModel.js";
import Project from "../models/ProjectModel.js";
import mongoose from "mongoose";

//add member
export const addMember = async (req, res) => {
    try {
        const { projectId, userId, assignedRole } = req.body;

        if (!projectId || !userId || !assignedRole) {
            return res.status(400).json({
                success: false,
                message: "projectId, userId and assignedRole are required"
            });
        }

        const project = await Project.findById(projectId);
        if (!project) return res.status(404).json({ success: false, message: "Project not found" });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const alreadyAdded = await ProjectTeam.findOne({ projectId, userId });
        if (alreadyAdded) return res.status(400).json({ success: false, message: "User already added to this project" });

        const member = await ProjectTeam.create({ projectId, userId, assignedRole });

        res.status(201).json({
            success: true,
            message: "Member added successfully",
            data: member
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//get all members of a specific project
export const getMembers = async (req, res) => {
    try {
        const { pid } = req.params;

        const members = await ProjectTeam.find({ projectId: pid })
            .populate("userId", "name email"); // user-friendly info

        res.status(200).json({ success: true, data: members });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//update member role
export const updateMemberRole = async (req, res) => {
    try {
        const { projectId, userId, assignedRole } = req.body;

        if (!projectId || !userId || !assignedRole) {
            return res.status(400).json({ success: false, message: "projectId, userId and assignedRole are required" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const updated = await ProjectTeam.findOneAndUpdate(
            { projectId, userId },
            { assignedRole },
            { new: true }
        );

        if (!updated) return res.status(404).json({ success: false, message: "Member not found in this project" });

        res.status(200).json({ success: true, message: "Role updated successfully", data: updated });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//remove member
export const removeMember = async (req, res) => {
    try {
        const { projectId, userId } = req.body;

        if (!projectId || !userId) {
            return res.status(400).json({ success: false, message: "projectId and userId are required" });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const deleted = await ProjectTeam.findOneAndDelete({ projectId, userId });
        if (!deleted) return res.status(404).json({ success: false, message: "Member not found in this project" });

        res.status(200).json({ success: true, message: "Member removed successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//get all projects of a specific user
export const getProjectsOfUser = async (req, res) => {
    try {
        const { uid } = req.params;

        const projects = await ProjectTeam.find({ userId: uid })
            .populate("projectId", "name description"); // optional project info

        res.status(200).json({ success: true, data: projects });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

//get all users for dropdown list
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, "name email"); // send only name and email
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
