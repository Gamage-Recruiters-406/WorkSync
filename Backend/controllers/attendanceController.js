import attendanceModel from "../models/attendanceModel.js";

//  Clock In (Create Attendance)
export const clockInController = async (req, res) => {
    try {
        const { date, status } = req.body;

        const userId = req.user.userid; 

        if (!date) {
            return res.status(400).send({ message: "Date is required" });
        }

        // DUPLICATE CHECK
        const existingAttendance = await attendanceModel.findOne({ userId, date });

        if (existingAttendance) {
            return res.status(400).send({
                success: false,
                message: "You have already clocked in for this date."
            });
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


// CLOCK OUT CONTROLLER
export const clockOutController = async (req, res) => {
    try {
        const { date } = req.body;
        
        const userId = req.user.userid;

        //  Find the record for THIS user on THIS date
        const attendance = await attendanceModel.findOne({ userId, date });

        if (!attendance) {
            return res.status(404).send({
                success: false,
                message: "Attendance record not found for today"
            });
        }

        if (attendance.outTime) {
            return res.status(400).send({
                success: false,
                message: "You have already clocked out today"
            });
        }

        attendance.outTime = new Date();

        await attendance.save();

        res.status(200).send({
            success: true,
            message: "Clock Out Successful",
            attendance
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Clock Out API",
            error
        });
    }
};


// Get All Attendance (Admin only)
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