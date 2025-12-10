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


// Controller 2: CLOCK OUT CONTROLLER
export const clockOutController = async (req, res) => {
    try {
        const { userId, date } = req.body;

        // 1.Find the record for THIS user on THIS date
        const attendance = await attendanceModel.findOne({ userId, date });

        // Validation: If no record exists, they never clocked in!
        if (!attendance) {
            return res.status(404).send({
                success: false,
                message: "Attendance record not found for today"
            });
        }

        // Validation: If outTime is already set, they already clocked out!
        if (attendance.outTime) {
            return res.status(400).send({
                success: false,
                message: "You have already clocked out today"
            });
        }

        // 2. Update the outTime to "NOW"
        attendance.outTime = new Date();

        // 3. Save the update
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


// Controller 3: Get All Attendance (Read)
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