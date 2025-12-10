import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // This links to your users
        required: true
    },
    date: {
        type: String, // Storing as 'YYYY-MM-DD' is simple for beginners
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Leave'],
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