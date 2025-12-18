import fs from "fs";
import mongoose from "mongoose";
import Project from "../models/ProjectModel.js";
import ProjectAttachment from "../models/ProjectAttachmentModel.js";

const MAX_ATTACHMENTS_PER_PROJECT = 5;

const cleanupFiles = async (files = []) => {
    await Promise.allSettled(
        files.map((f) => fs.promises.unlink(f.path).catch(() => null))
    );
};

// Upload a new attachment to a project
export const addProjectAttachmentController = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });   
        }

        const files = req.files || [];
        if (files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files uploaded",
            });
        }

        // Check if project exists
        const project = await Project.findById(projectId).select("_id");
        if (!project) {
            await cleanupFiles(files);
            return res.status(404).json({
                success: false,
                message: "Project not found",
            });
        }

        // Enforce TOTAL max 5 per project (across multiple uploads)
        const existingCount = await ProjectAttachment.countDocuments({ projectId});
        const incomingCount = files.length;

        if (existingCount + incomingCount > MAX_ATTACHMENTS_PER_PROJECT) {
            await cleanupFiles(files);
            return res.status(400).json({
                success: false,
                message: `Max ${MAX_ATTACHMENTS_PER_PROJECT} attachments per project. Already: ${existingCount}, trying to add: ${incomingCount}`,
            });
        }

        const docs = files.map((file) => ({
            projectId,
            originalName: file.originalname,
            filename: file.filename,
            fileType: file.mimetype,
            fileSize: file.size,
            filePath: file.path.replace(/\\/g, "/"),
        }));

        const created = await ProjectAttachment.insertMany(docs, { ordered: true });
        const totalCount = existingCount + created.length;

        return res.status(201).json({
            success: true,
            message: "Attachments uploaded successfully",
            addedCount: created.length,
            totalCount,
            data: created,
        });
    } catch (error) {
        console.error("Error uploading attachment:", error);
         // if multer already stored files but error happened after, try cleanup
         if (req.files?.length) await cleanupFiles(req.files);
        return res.status(500).json({
            success: false,
            message: "Error uploading attachment",
            error: error.message,
        });
    }
};