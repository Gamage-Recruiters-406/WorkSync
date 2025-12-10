import attendanceModel from "../models/attendanceModel.js";
import User from "../models/User.js";

// CHECK IN (Create Attendance)
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
            message: "Check In Successful",
            newAttendance
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Check In API",
            error
        });
    }
};


// CHECK OUT 
export const clockOutController = async (req, res) => {
    try {
        const { date } = req.body;
        
        const userId = req.user.userid;

        // Find the record for THIS user on THIS date
        const attendance = await attendanceModel.findOne({ userId, date });

        if (!attendance) {
            return res.status(404).send({
                success: false,
                message: "Attendance record not found for today"
            });
        }

        // DUPLICATE CHECK
        if (attendance.outTime) {
            return res.status(400).send({
                success: false,
                message: "You have already Checked Out today"
            });
        }

        attendance.outTime = new Date();

        await attendance.save();

        res.status(200).send({
            success: true,
            message: "Check Out Successful",
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


// Get All Attendance
export const getAttendanceController = async (req, res) => {
    try {
        const { role, userid } = req.user;
        const { viewType, date } = req.query; 

        let query = {};

       
        if (role === 3) { // ADMIN
            
        } 
        else if (role === 2) { // MANAGER
            
            const employees = await User.find({ role: 1 }).select("_id");
            const allowedIds = employees.map(user => user._id);
            allowedIds.push(userid);
            query.userId = { $in: allowedIds };
        } 
        else { // EMPLOYEE

            query.userId = userid;
        }

        // DATE FILTERING 
        const targetDate = date ? new Date(date) : new Date(); 
        
        if (viewType === 'month') {
            
            // For get Monthly records
            const yearMonth = targetDate.toISOString().slice(0, 7); 
            query.date = { $regex: `^${yearMonth}` };
        } 
        else if (viewType === 'week') { 

            // For get Weekly records
            const currentDay = targetDate.getDay(); 
            const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;

            const startOfWeek = new Date(targetDate);
            startOfWeek.setDate(targetDate.getDate() - diffToMonday);
            
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); 

            query.date = { 
                $gte: startOfWeek.toISOString().split('T')[0], 
                $lte: endOfWeek.toISOString().split('T')[0] 
            };
        }
        else if (viewType === 'daily') {

            // For get Daily records
            query.date = targetDate.toISOString().split('T')[0];
        }


        // EXECUTE QUERY 
        const attendanceRecords = await attendanceModel.find(query)
            .populate('userId', 'name email role') 
            .sort({ date: -1 })
            .lean(); // Use .lean() to get 'hoursWorked'


        // CALCULATE SUMMARY (total Hours and Days)
        let totalHoursWorked = 0;
        let daysPresent = 0;

        // Count Total Hours
        const enrichedAttendance = attendanceRecords.map(record => {
            let hours = 0;
             
            if (record.inTime && record.outTime) {  // Only calculate if they have clocked out
                const start = new Date(record.inTime);
                const end = new Date(record.outTime);
                
                hours = (end - start) / (1000 * 60 * 60); // Difference in milliseconds / 1000 / 60 / 60 = Hours
                totalHoursWorked += hours;
            }

            // Count Total Hours
            if (record.status === 'Present') {
                daysPresent++;
            }

            // Add the calculated 'hours' to this specific record for the frontend
            return { ...record, hoursWorked: hours.toFixed(2) }; 
        });

        res.status(200).send({
            success: true,
            summary: {
                viewType: viewType || "all-time",
                totalDaysPresent: daysPresent,
                totalHoursWorked: totalHoursWorked.toFixed(2) 
            },
            count: enrichedAttendance.length,
            attendance: enrichedAttendance
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