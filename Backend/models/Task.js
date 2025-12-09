import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deadline: { type: Date },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);
