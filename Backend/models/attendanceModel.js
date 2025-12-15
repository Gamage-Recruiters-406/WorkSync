import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    date: {
        type: String, 
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent'], 
        default: 'Present'
    },
    inTime: {
        type: Date,
        default: Date.now
    },
    outTime: {
        type: Date
    }
}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);