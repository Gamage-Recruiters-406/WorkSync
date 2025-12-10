import attendanceModel from "../models/attendanceModel.js";

// Controller 1: Clock In (Create Attendance)
export const clockInController = async (req, res) => {
    try {
        const { userId, date, status } = req.body;

        // Validation
        if (!userId) {
            return res.status(400).send({ message: "User ID is required" });
        }

        const newAttendance = new attendanceModel({
            userId,
            date,
            status,
            inTime: new Date()
        });

        await newAttendance.save();

        res.status(201).send({
            success: true,
            message: "Clock In Successful",
            newAttendance
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Clock In API",
            error
        });
    }
};

// Controller 2: Get All Attendance (Read)
export const getAttendanceController = async (req, res) => {
    try {
        const attendance = await attendanceModel.find({});
        res.status(200).send({
            success: true,
            count: attendance.length,
            attendance
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting attendance",
            error
        });
    }
};