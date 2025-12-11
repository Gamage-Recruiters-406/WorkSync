import mongoose from "mongoose";

const ProjectTeamSchema = new mongoose.Schema({
    projectId: { type: String, required: true }, // changed from ObjectId to String
    userId: { type: String, required: true },    // changed from ObjectId to String
    assignedRole: { type: String, required: true },
    teamId: { type: String }                      // teamId as String for simplicity
}, { timestamps: true });

export default mongoose.model("ProjectTeam", ProjectTeamSchema);
