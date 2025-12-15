import attendanceModel from "../models/attendanceModel.js";
import User from "../models/User.js";
import ExcelJS from 'exceljs';       
import PDFDocument from 'pdfkit';    


// 1. START ATTENDANT 
export const clockInController = async (req, res) => {
    try {
        const { date } = req.body; 
        const userId = req.user.userid; 

        if (!date) {
            return res.status(400).send({ message: "Date is required" });
        }

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
            status: "Present", 
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
        res.status(500).send({ success: false, message: "Error in Check In API", error });
    }
};


// 2. END ATTENDANCE 
export const clockOutController = async (req, res) => {
    try {
        const { date } = req.body;
        const userId = req.user.userid; 

        const attendance = await attendanceModel.findOne({ userId, date });

        if (!attendance) {
            return res.status(404).send({ success: false, message: "Attendance record not found for today" });
        }

        if (attendance.outTime) {
            return res.status(400).send({ success: false, message: "You have already Checked Out today" });
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
        res.status(500).send({ success: false, message: "Error in Clock Out API", error });
    }
};


// 3. GET ATTENDANT (Admin/Manager)
export const getAttendanceController = async (req, res) => {
    try {
        const { role, userid } = req.user;
        const { viewType, date } = req.query; 

        let query = {};

        if (role === 3) { 
        } else if (role === 2) { 
            const employees = await User.find({ role: 1 }).select("_id");
            const allowedIds = employees.map(user => user._id);
            allowedIds.push(userid);
            query.userId = { $in: allowedIds };
        } else { 
            query.userId = userid;
        }

        const targetDate = date ? new Date(date) : new Date(); 
        if (viewType === 'month') {
            const yearMonth = targetDate.toISOString().slice(0, 7); 
            query.date = { $regex: `^${yearMonth}` };
        } else if (viewType === 'week') { 
            const currentDay = targetDate.getDay(); 
            const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
            const startOfWeek = new Date(targetDate);
            startOfWeek.setDate(targetDate.getDate() - diffToMonday);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6); 
            query.date = { $gte: startOfWeek.toISOString().split('T')[0], $lte: endOfWeek.toISOString().split('T')[0] };
        } else if (viewType === 'daily') {
            query.date = targetDate.toISOString().split('T')[0];
        }

        const attendanceRecords = await attendanceModel.find(query)
            .populate('userId', 'name email role') 
            .sort({ date: -1 })
            .lean(); 

        // Enrich with Hours Calculation
        const enrichedAttendance = attendanceRecords.map(record => {
            let hours = 0;
            if (record.inTime && record.outTime) { 
                const start = new Date(record.inTime);
                const end = new Date(record.outTime);
                hours = (end - start) / (1000 * 60 * 60); 
            }
            return { ...record, hoursWorked: hours.toFixed(2) }; 
        });

        res.status(200).send({
            success: true,
            count: enrichedAttendance.length,
            attendance: enrichedAttendance 
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error in getting attendance", error });
    }
};


// 4. GET SINGLE USER ATTENDANCE 
export const getSingleUserAttendanceController = async (req, res) => {
    try {
        const { id } = req.params; 
        
        const attendanceRecords = await attendanceModel.find({ userId: id })
            .populate('userId', 'name email')
            .sort({ date: -1 })
            .lean();

        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(404).send({ success: false, message: "No records found for this user" });
        }

        // Calculate Hours for Single User 
        const enrichedAttendance = attendanceRecords.map(record => {
            let hours = 0;
            if (record.inTime && record.outTime) { 
                const start = new Date(record.inTime);
                const end = new Date(record.outTime);
                hours = (end - start) / (1000 * 60 * 60); 
            }
            return { ...record, hoursWorked: hours.toFixed(2) }; 
        });

        res.status(200).send({
            success: true,
            count: enrichedAttendance.length,
            attendance: enrichedAttendance
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error fetching user attendance", error });
    }
};



// 5. ATTENDANCE REPORT (Excel/PDF)
const buildExportQuery = async (req) => {
    const { role, userid } = req.user;
    const { viewType, date } = req.query; 
    let query = {};

    if (role === 3) {
    } else if (role === 2) {
        const employees = await User.find({ role: 1 }).select("_id");
        const allowedIds = employees.map(user => user._id);
        allowedIds.push(userid);
        query.userId = { $in: allowedIds };
    } else {
        query.userId = userid;
    }

    const targetDate = date ? new Date(date) : new Date();

    if (viewType === 'month') {
        const yearMonth = targetDate.toISOString().slice(0, 7); 
        query.date = { $regex: `^${yearMonth}` };
    } else if (viewType === 'week') { 
        const currentDay = targetDate.getDay(); 
        const diffToMonday = currentDay === 0 ? 6 : currentDay - 1;
        const startOfWeek = new Date(targetDate);
        startOfWeek.setDate(targetDate.getDate() - diffToMonday);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6); 
        query.date = { $gte: startOfWeek.toISOString().split('T')[0], $lte: endOfWeek.toISOString().split('T')[0] };
    } else if (viewType === 'daily') {
        query.date = targetDate.toISOString().split('T')[0];
    }
    return query;
};

// Unified Export Controller 
export const generateAttendanceReport = async (req, res) => {
    try {
        const { type } = req.query; // Check "pdf" or "excel"

        if (type === 'pdf') {
            return exportAttendancePDF(req, res);
        } else {
            return exportAttendanceExcel(req, res);
        }
    } catch (error) {
         res.status(500).send({ message: "Error generating report" });
    }
};

// Excel Function 
const exportAttendanceExcel = async (req, res) => {
    try {
        const query = await buildExportQuery(req);
        const attendanceData = await attendanceModel.find(query).populate('userId', 'name email').sort({ date: -1 });

        let totalHoursWorked = 0;
        let daysPresent = 0;
        attendanceData.forEach(record => {
            if (record.status === 'Present') daysPresent++;
            if (record.inTime && record.outTime) {
                const start = new Date(record.inTime);
                const end = new Date(record.outTime);
                totalHoursWorked += (end - start) / (1000 * 60 * 60);
            }
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Attendance Report');
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Employee Name', key: 'name', width: 25 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Check In (SL Time)', key: 'inTime', width: 25 },
            { header: 'Check Out (SL Time)', key: 'outTime', width: 25 },
            { header: 'Email', key: 'email', width: 30 }
        ];

        const formatSLTime = (date) => {
            if (!date) return '-';
            return new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Colombo', dateStyle: 'medium', timeStyle: 'short' });
        };

        attendanceData.forEach(record => {
            worksheet.addRow({
                date: record.date,
                name: record.userId ? record.userId.name : 'Unknown',
                status: record.status,
                inTime: formatSLTime(record.inTime),
                outTime: formatSLTime(record.outTime),
                email: record.userId ? record.userId.email : '-'
            });
        });

        worksheet.addRow([]); 
        worksheet.addRow(['SUMMARY REPORT']);
        worksheet.addRow(['Total Days Present', daysPresent]);
        worksheet.addRow(['Total Hours Worked', totalHoursWorked.toFixed(2)]);
        
        const filename = `Attendance_Report_${req.query.viewType || 'All'}.xlsx`;
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error exporting Excel", error });
    }
};

// PDF Function 
const exportAttendancePDF = async (req, res) => {
    try {
        const query = await buildExportQuery(req);
        const attendanceData = await attendanceModel.find(query).populate('userId', 'name email').sort({ date: -1 });

        let totalHoursWorked = 0;
        let daysPresent = 0;
        attendanceData.forEach(record => {
            if (record.status === 'Present') daysPresent++;
            if (record.inTime && record.outTime) {
                const start = new Date(record.inTime);
                const end = new Date(record.outTime);
                totalHoursWorked += (end - start) / (1000 * 60 * 60);
            }
        });

        const doc = new PDFDocument();
        const filename = `Attendance_Report_${req.query.viewType || 'All'}.pdf`;
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        doc.pipe(res);

        const title = `Attendance Report (${req.query.viewType || 'All Time'})`;
        doc.fontSize(20).text(title, { align: 'center' });
        doc.moveDown();

        const formatSLTime = (date) => {
            if (!date) return '-';
            return new Date(date).toLocaleString('en-US', { timeZone: 'Asia/Colombo', hour12: true, hour: '2-digit', minute: '2-digit' });
        };

        attendanceData.forEach((record, index) => {
            const inTimeDisplay = formatSLTime(record.inTime);
            const outTimeDisplay = formatSLTime(record.outTime);
            const userName = record.userId ? record.userId.name : "Unknown";
            const line = `${index + 1}. [${userName}] Date: ${record.date} | In: ${inTimeDisplay} | Out: ${outTimeDisplay}`;
            doc.fontSize(12).text(line);
            doc.moveDown(0.5);
        });

        doc.moveDown();
        doc.text("---------------------------------------------------");
        doc.fontSize(14).text(`Total Days Present: ${daysPresent}`);
        doc.fontSize(14).text(`Total Hours Worked: ${totalHoursWorked.toFixed(2)}`);
        doc.end();
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error exporting PDF", error });
    }
};


// 6. UPDATE ATTENDANCE (Admin Fix )
export const updateAttendanceController = async (req, res) => {
    try {
        const { attendanceId } = req.params;
        const { outTime, status } = req.body;
        const attendance = await attendanceModel.findById(attendanceId);

        if (!attendance) return res.status(404).send({ success: false, message: "Attendance record not found" });

        if (status) attendance.status = status;
        if (outTime) {
            const newOutTime = new Date(outTime);
            if (newOutTime < attendance.inTime) return res.status(400).send({ success: false, message: "Out Time cannot be before In Time!" });
            attendance.outTime = newOutTime;
        }

        await attendance.save();
        res.status(200).send({ success: true, message: "Attendance Updated Successfully", attendance });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error updating attendance", error });
    }
};