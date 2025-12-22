import mongoose, { Schema } from "mongoose";

const milestoneSchema = new mongoose.Schema({
    projectID:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    }],
    milestoneName: {
        type: String,
        required: true
    },
    Description: {
        type: String,
    },
    Start_Date: {
        type: Date
    },
    End_Date: {
        type: Date,
        required: true
    },
    Status: {
        type: String,
        enum:["Completed", "In Progress", "Not Started"],
        default: "Not Started"
    }

},{timestamps: true});

export default mongoose.model("Milestones", milestoneSchema);
