import mongoose from "mongoose";
import PDFDocument from "pdfkit";

import Project from "../models/ProjectModel.js";
import ProjectTeam from "../models/ProjectTeam.js";
import Milestone from "../models/milestoneModel.js";
import Task from "../models/Task.js";



const fmtDate = (d) => {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "-";
  return dt.toISOString().slice(0, 10);
};

const namesOrDash = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return "-";
  const names = arr
    .map((u) => {
      if (!u || typeof u !== "object") return null;
      const fn = u.FirstName || "";
      const ln = u.LastName || "";
      const full = `${fn} ${ln}`.trim();
      return full || null;
    })
    .filter(Boolean);

  return names.length ? names.join(", ") : "-";
};

const ensureSpace = (doc, needed = 60) => {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + needed > bottom) doc.addPage();
};



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


// Get single project
export const getSingleProjectController = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findById(id)
            .populate("createdBy", "name email")
            .populate("teamLeader", "name email")
            .lean();

            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: "Project not found",
                });
            }

            return res.status(200).json({
                success: true,
                message: "Project fetched successfully",
                data: project
            });
    } catch (error) {
        // Invalid ObjectId
        if (error?.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID",
            });
        }

        console.error("Error fetching project:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching project",
            error: error.message
        });
    }
};


// Get all projects
export const getAllProjectsController = async (req, res) => {
    try {
        const projects = await Project.find()
            .sort({ createdAt: -1 })
            .populate("createdBy", "name email")
            .populate("teamLeader", "name email");

        return res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching projects",
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



// Project Report PDF generation
export const projectProgressReportController = async (req, res) => {
  let doc; // keep reference so we can safely end/destroy on errors

  try {
    const { id: projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ success: false, message: "Invalid project ID" });
    }

    // ✅ 1) DB WORK FIRST (no doc.pipe yet)
    const project = await Project.findById(projectId)
      .populate("createdBy", "FirstName LastName email")
      .populate("teamLeader", "FirstName LastName email")
      .lean();

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const milestones = await Milestone.find({ projectID: projectId })
      .populate("assignedTo", "FirstName LastName email")
      .sort({ Start_Date: 1 })
      .lean();

    const milestoneIds = milestones.map((m) => m._id);

    const tasks = milestoneIds.length
      ? await Task.find({ milestone: { $in: milestoneIds } })
          .populate("assignedTo", "FirstName LastName email")
          .populate("milestone", "milestoneName")
          .sort({ createdAt: 1 })
          .lean()
      : [];

    const tasksByMilestone = new Map();
    for (const t of tasks) {
      const msId =
        t.milestone && typeof t.milestone === "object"
          ? String(t.milestone._id)
          : String(t.milestone);

      if (!tasksByMilestone.has(msId)) tasksByMilestone.set(msId, []);
      tasksByMilestone.get(msId).push(t);
    }

    // ✅ 2) NOW START STREAMING PDF (only after all possible DB errors are done)
    doc = new PDFDocument({ margin: 30, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=project-progress-report-${projectId}.pdf`
    );

    // If client disconnects while streaming, stop writing
    res.on("close", () => {
      if (doc) doc.destroy();
    });

    doc.on("error", (e) => {
      console.error("PDFKit error:", e);
      // can't send JSON if headers already sent
      if (!res.headersSent) {
        res.status(500).json({ success: false, message: "PDF generation error" });
      } else {
        res.end();
      }
    });

    doc.pipe(res);

    // ✅ 3) PDF CONTENT
    doc.fontSize(18).text("Project Progress Report", { align: "center" });
    doc.moveDown(0.8);

    doc.fontSize(12).text(`Project Name: ${project.name || "-"}`);
    doc.text(`Status: ${project.status || "-"}`);
    doc.text(`Start Date: ${fmtDate(project.startDate)}    End Date: ${fmtDate(project.endDate)}`);
    doc.text(`Team Leader: ${namesOrDash([project.teamLeader].filter(Boolean))}`);
    doc.text(`Created By: ${namesOrDash([project.createdBy].filter(Boolean))}`);
    doc.moveDown(0.8);

    doc.moveTo(doc.page.margins.left, doc.y)
      .lineTo(doc.page.width - doc.page.margins.right, doc.y)
      .stroke();
    doc.moveDown(0.8);

    if (!milestones.length) {
      doc.text("No milestones found for this project.");
      doc.end();
      return;
    }

    milestones.forEach((ms, idx) => {
      ensureSpace(doc, 90);

      doc.fontSize(14).text(`${idx + 1}. Milestone: ${ms.milestoneName || "-"}`, { underline: true });
      doc.moveDown(0.2);

      doc.fontSize(11).text(`Status: ${ms.Status || "-"}`);
      doc.text(`Start: ${fmtDate(ms.Start_Date)}    End: ${fmtDate(ms.End_Date)}`);
      doc.text(`Assigned To: ${namesOrDash(ms.assignedTo)}`);
      if (ms.Description) doc.text(`Description: ${ms.Description}`);
      doc.moveDown(0.4);

      const msTasks = tasksByMilestone.get(String(ms._id)) || [];
      doc.fontSize(12).text("Tasks:", { underline: true });
      doc.moveDown(0.2);

      if (!msTasks.length) {
        doc.fontSize(11).text("- No tasks under this milestone");
        doc.moveDown(0.6);
        return;
      }

      msTasks.forEach((t) => {
        ensureSpace(doc, 50);
        doc.fontSize(11).text(
          `- ${t.title || "-"} | ${t.status || "-"} | ${t.priority || "-"} | Deadline: ${fmtDate(t.deadline)} | Assigned: ${namesOrDash(t.assignedTo)}`
        );
        if (t.description) doc.fontSize(10).text(`  ${t.description}`);
      });

      doc.moveDown(0.8);
    });

    doc.end();
  } catch (error) {
    console.error("projectProgressReportController error:", error);

    // ✅ Important: if streaming already started, do NOT send JSON
    if (res.headersSent) {
      try {
        if (doc) doc.end();
      } catch {}
      return res.end();
    }

    return res.status(500).json({
      success: false,
      message: "Error generating project progress report",
      error: error.message,
    });
  }
};