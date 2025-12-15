import mongoose from "mongoose";

const ProjectTeamSchema = new mongoose.Schema({
    projectId: { type: String, required: true },
    userId: { type: String, required: true },
    assignedRole: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("ProjectTeam", ProjectTeamSchema);
