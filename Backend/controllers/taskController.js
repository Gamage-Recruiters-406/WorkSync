import fs from "fs";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import TaskAttachment from "../models/TaskAttachmentModel.js";

const formatTaskForClient = (taskDoc) => {
    if (!taskDoc) return taskDoc;

    const task = typeof taskDoc.toObject === "function" ? taskDoc.toObject({ virtuals: true }) : taskDoc;
    const assigned = Array.isArray(task.assignedTo) ? task.assignedTo : [];

    return {
        ...task,
        assignedTo: assigned
            .map((u) => (typeof u === "object" && u !== null ? u.name : null))
            .filter(Boolean),
        milestone: task.milestone && typeof task.milestone === "object" ? task.milestone.milestoneName : null,
    };
};

const cleanupFiles = async (files = []) => {
    await Promise.allSettled(files.map((f) => fs.promises.unlink(f.path).catch(() => null)));
};

// CREATE TASK
export const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            assignedTo,
            deadline,
            priority,
            milestone
        } = req.body || {};
        console.log("BODY:", req.body);
        console.log("FILES:", req.files);


        const incomingFiles = req.files || [];
        if (incomingFiles.length > 5) {
            await cleanupFiles(incomingFiles);
            return res.status(400).json({
                success: false,
                message: "Max 5 attachments per task",
            });
        }

        const taskId = req.generatedTaskId && mongoose.Types.ObjectId.isValid(req.generatedTaskId)
            ? req.generatedTaskId
            : undefined;

        const normalizedAssignedTo = assignedTo === undefined
            ? undefined
            : Array.isArray(assignedTo)
                ? assignedTo
                : [assignedTo];

        const created = await Task.create({
            ...(taskId ? { _id: taskId } : {}),
            title,
            description,
            assignedTo: normalizedAssignedTo,
            deadline,
            priority,
            milestone,
            status: "Pending",
        });

        // If attachments were included in the same request, create TaskAttachment docs now
        if (incomingFiles.length) {
            try {
                const docs = incomingFiles.map((file) => ({
                    taskId: created._id,
                    originalName: file.originalname,
                    filename: file.filename,
                    fileType: file.mimetype,
                    fileSize: file.size,
                    filePath: file.path.replace(/\\/g, "/"),
                }));

                await TaskAttachment.insertMany(docs, { ordered: true });
            } catch (attachmentError) {
                // Roll back task if attachments fail; also clean up stored files
                await cleanupFiles(incomingFiles);
                await Task.findByIdAndDelete(created._id).catch(() => null);

                return res.status(500).json({
                    success: false,
                    message: "Error creating task attachments",
                    error: attachmentError.message,
                });
            }
        }

        const task = await Task.findById(created._id)
            .populate("assignedTo", "name")
            .populate("milestone", "milestoneName");

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: formatTaskForClient(task)
        });
    } catch (error) {
        if (req.files?.length) await cleanupFiles(req.files);
        res.status(500).json({
            success: false,
            message: "Error creating task",
            error: error.message
        });
    }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        await task.deleteOne();
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting task",
            error: error.message
        });
    }
};

// UPDATE TASK
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, assignedTo, deadline, priority, status, milestone } = req.body;

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (deadline !== undefined) task.deadline = deadline;
        if (priority !== undefined) task.priority = priority;
        if (status !== undefined) task.status = status;
        if (milestone !== undefined) task.milestone = milestone;

        if (assignedTo !== undefined) {
            task.assignedTo = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
        }

        await task.save();
        const populated = await Task.findById(task._id)
            .populate("assignedTo", "name")
            .populate("milestone", "milestoneName");

        res.status(200).json({ success: true, message: "Task updated successfully", data: formatTaskForClient(populated) });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating task", error: error.message });
    }
};

// GET ALL TASKS FOR USER
export const getAllTasks = async (req, res) => {

    try {
        const tasks = await Task.find()
            .populate("assignedTo", "name")
            .populate("milestone", "milestoneName")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: tasks.map(formatTaskForClient) });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch tasks", error: error.message });
    }
};

// GET SINGLE TASK
export const getAllUserTasks = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name")
            .populate("milestone", "milestoneName");
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        res.status(200).json({ success: true, data: formatTaskForClient(task) });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching task", error: error.message });
    }
};

// UPDATE STATUS
export const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        task.status = status;
        await task.save();
        const populated = await Task.findById(task._id)
            .populate("assignedTo", "name")
            .populate("milestone", "milestoneName");
        res.status(200).json({ success: true, message: "Task status updated", data: formatTaskForClient(populated) });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating task status", error: error.message });
    }
};

// MARK TASK AS DONE
export const markDone = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        task.status = "Completed";
        await task.save();
        const populated = await Task.findById(task._id)
            .populate("assignedTo", "name")
            .populate("milestone", "milestoneName");
        res.status(200).json({ success: true, message: "Task marked as completed", data: formatTaskForClient(populated) });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error marking task as done", error: error.message });
    }
};

// MARK IN PROGRESS
export const inProgress = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        task.status = "In Progress";
        await task.save();
        res.status(200).json({ success: true, message: "Task marked as in progress", data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error marking task as in progress", error: error.message });
    }
};


// FILTER TASKS BY PROJECT
export const filterProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { user, priority, startDate, endDate } = req.query;

        const query = { project: projectId };
        if (user) query.assignedTo = user;
        if (priority) query.priority = priority;
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const tasks = await Task.find(query)
            .populate("assignedTo", "name")
            .populate("milestone", "milestoneName")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: tasks.map(formatTaskForClient) });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to filter tasks", error: error.message });
    }
};

// GET TASKS BY PROJECT
export const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await Task.find({ project: projectId })
            .populate("assignedTo", "name")
            .populate("milestone", "milestoneName")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: tasks.map(formatTaskForClient) });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch project tasks", error: error.message });
    }
};
