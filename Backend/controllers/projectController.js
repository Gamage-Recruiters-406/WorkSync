import Project from "../models/ProjectModel.js";

// Create a new project
export const createProjectController = async (req, res) => {
    try {
        const { name, description, startDate, endDate, status, teamLeaderId } = req.body;

        // Basic required-field validation
        if (!name || !description || !startDate || !teamLeaderId) {
            return res.status(400).json({ 
                success : false,
                message: "Name, Description, Start Date and Team Leader are required" 
            });
        }

        // Date validation (if endDate is sent)
        if (endDate && new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date."
            });
        }

        // Check for duplicate project name (case-insensitive)
        const existingProject = await Project.findOne({
            name: { $regex: `^${name}$`, $options: 'i' }
        });

        if (existingProject) {
            return res.status(400).json({
                success: false,
                message: "A project with this name already exists"
            });
        }

        // createdBy from JWT token (requiredSignIn put payload in req.user)
        const createdBy = req.user.userid;

        const project = await Project.create({
            name,
            description,
            startDate,
            endDate,
            status,
            createdBy,
            teamLeader: teamLeaderId,
        });

        res.status(201).json({
            success:true,
            message: "Project created successfully",
            data: project
        });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({
            success: false,
            message: "Error creating project",
            error: error.message
        });
    }
};


// Update a project
export const updateProjectController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, startDate, endDate, status, teamLeaderId } = req.body;

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // If name is updated -> block duplicates (case-insensitive), excluding current project
        if (name && name.trim()) {
            const existingProject = await Project.findOne({
                _id: { $ne: id },
                name: { $regex: `^${name.trim()}$`, $options: 'i' }
            });

            if (existingProject) {
                return res.status(400).json({
                    success: false,
                    message: "A project with this name already exists"
                });
            }
        }

        // Date validation using "final values" (new value if provided, else existing value)
        const finalStartDate = startDate ? new Date(startDate) : project.startDate;
        const finalEndDate = endDate ? new Date(endDate) : project.endDate;

        if (finalEndDate && finalStartDate && finalEndDate < finalStartDate) {
            return res.status(400).json({
                success: false,
                message: "End date cannot be before start date."
            });
        }

        // Apply updates
        if (name !== undefined) project.name = name;
        if (description !== undefined) project.description = description;
        if (startDate !== undefined) project.startDate = startDate;
        if (endDate !== undefined) project.endDate = endDate;
        if (status !== undefined) project.status = status;
        if (teamLeaderId !== undefined) project.teamLeader = teamLeaderId;

        const updatedProject = await project.save();

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: updatedProject
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({
            success: false,
            message: "Error updating project",
            error: error.message
        });
    }
};


// Delete a project
export const deleteProjectController = async (req,res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Project ID is required",
            });
        }

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        await Project.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting project",
            error: error.message
        });
    }
};