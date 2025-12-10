import Task from "../models/Task.js";

// CREATE TASK
export const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, deadline, priority, status } = req.body;

        const task = await Task.create({
            title,
            description,
            assignedTo,
            deadline,
            priority,
            status
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: task
        });
    } catch (error) {
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
        res.status(500).json({ success: false, message: "Error deleting task", error: error.message });
    }
};
