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
    },

    correction: {
        isRequested: { type: Boolean, default: false },
        requestType: { type: String, enum: ['CheckIn', 'CheckOut', null], default: null }, 
        requestedTime: { type: Date, default: null }, 
        reason: { type: String, default: "" }, 
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected', null], default: null } 
    }

}, { timestamps: true });

export default mongoose.model("Attendance", attendanceSchema);