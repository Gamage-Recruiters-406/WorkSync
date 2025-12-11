import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ["active", "on-hold", "completed"],
        default: "active"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    attachments: [
        {
            data: Buffer,
            originalName: String,
            fileType: String,
            fileSize: Number,
            uploadedAt: {
                type: Date,
                default: Date.now
            },
        }
    ]
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);