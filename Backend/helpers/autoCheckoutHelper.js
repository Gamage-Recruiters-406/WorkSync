import cron from "node-cron";
import attendanceModel from "../models/attendanceModel.js";
import Employee from "../models/EmployeeModel.js"; // <--- 1. CHANGED IMPORT

export const startAutoCheckoutJob = () => {
    
    // MARK ABSENT AT 10:00 AM (SL Time)
    // Runs at 17:23 Server Time (Adjust this cron time if needed based on your server location)
    cron.schedule("00 10 * * *", async () => {
        console.log(" [CRON] Running 10:00 AM Absent Check...");

        try {
            const now = new Date();
            const slTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
            const todayStr = slTime.toISOString().split("T")[0];

            // 2. CHANGED: Get all employees from the new Employee table (Role 1)
            // We select '_id' because that's all we need to match with attendance
            const allEmployees = await Employee.find({ role: 1 }).select("_id");

            // Get everyone who has ALREADY clocked in today
            const presentAttendance = await attendanceModel.find({ date: todayStr }).select("userId");
            const presentUserIds = presentAttendance.map(record => record.userId.toString());

            // Find who is MISSING
            // Compare Employee IDs vs. Attendance UserIDs
            const absentUsers = allEmployees.filter(emp => !presentUserIds.includes(emp._id.toString()));

            if (absentUsers.length === 0) {
                console.log(" [CRON] Everyone is present today!");
                return;
            }

            console.log(` [CRON] Found ${absentUsers.length} employees absent at 10:00 AM.`);

            // Create "Absent" records 
            const absentRecords = absentUsers.map(emp => ({
                userId: emp._id,
                date: todayStr,
                status: "Absent",
                inTime: null,
                outTime: null 
            }));

            // Bulk insert is faster
            if (absentRecords.length > 0) {
                await attendanceModel.insertMany(absentRecords);
                console.log(" [CRON] marked all missing users as Absent.");
            }

        } catch (error) {
            console.error(" [CRON] Error in Absent Check:", error);
        }
    });



    // AUTO CHECKOUT AT 7:30 PM
    cron.schedule("30 19 * * *", async () => {
        console.log(" [CRON] Running Auto Check-Out Job...");

        try {
            const now = new Date();
            const slTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
            const todayStr = slTime.toISOString().split("T")[0];

            
            const forgotToCheckoutUsers = await attendanceModel.find({
                date: todayStr,
                outTime: { $exists: false },
                status: { $ne: "Absent" } 
            });

            if (forgotToCheckoutUsers.length === 0) {
                console.log(" [CRON] No users found who forgot to checkout.");
                return;
            }

            console.log(` [CRON] Found ${forgotToCheckoutUsers.length} users to auto-checkout.`);

            for (const record of forgotToCheckoutUsers) {
                //  Set Out Time to 1:00 PM (13:00)
                const autoOutTime = new Date();
                autoOutTime.setHours(13, 0, 0, 0); 
                record.outTime = autoOutTime;
    
                if (record.inTime) {
                    const inTimeSL = new Date(record.inTime).toLocaleString("en-US", { timeZone: "Asia/Colombo" });
                    const inHour = new Date(inTimeSL).getHours(); 

                    if (inHour < 9) {
                        record.status = "Present";
                    } else if (inHour === 9) {
                        record.status = "Late";
                    } else {
                        record.status = "Absent";
                    }
                }
                
                await record.save();
                console.log(`   -> Auto-checked out ID: ${record.userId} | Status: ${record.status}`);
            }

            console.log(" [CRON] Auto Check-Out Complete.");

        } catch (error) {
            console.error(" [CRON] Error in auto checkout:", error);
        }
    });
};