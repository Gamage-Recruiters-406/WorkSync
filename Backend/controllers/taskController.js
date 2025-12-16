import Task from "../models/Task.js";

// CREATE TASK
export const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, deadline, priority } = req.body;

        const task = await Task.create({
            title,
            description,
            assignedTo,
            deadline,
            priority,
            // Force status to be "Pending" regardless of what was sent in the request
            status: "Pending"
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

// UPDATE TASK
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, assignedTo, deadline, priority ,status } = req.body;

        // Find the task first
        const task = await Task.findById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        // Update all fields that are provided
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (deadline !== undefined) task.deadline = deadline;
        if (priority !== undefined) task.priority = priority;
        if (status !== undefined) task.status = status;

        if (assignedTo !== undefined) {
            if (Array.isArray(assignedTo)) {
                task.assignedTo = assignedTo;
            } else {
                task.assignedTo = [assignedTo];
            }
        }

        // Save the updated task
        await task.save();

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            data: task
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating task",
            error: error.message
        });
    }
};
