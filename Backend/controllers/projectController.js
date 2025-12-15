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