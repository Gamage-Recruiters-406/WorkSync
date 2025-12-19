import cron from "node-cron";
import attendanceModel from "../models/attendanceModel.js";

export const startAutoCheckoutJob = () => {
    
    // Schedule: Runs every day at 19:30 (7:30 PM)
    cron.schedule("30 19 * * *", async () => {
        console.log("[CRON] Running Auto Check-Out Job...");

        try {
            const now = new Date();
            const slTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Colombo" }));
            const todayStr = slTime.toISOString().split("T")[0];

            // Find users who clocked in TODAY but have NO clock out time
            const forgotToCheckoutUsers = await attendanceModel.find({
                date: todayStr,
                outTime: { $exists: false } 
            });

            if (forgotToCheckoutUsers.length === 0) {
                console.log("[CRON] No users found who forgot to checkout.");
                return;
            }

            console.log(`[CRON] Found ${forgotToCheckoutUsers.length} users to auto-checkout.`);

            for (const record of forgotToCheckoutUsers) {
                // 1. Set Out Time to 1:00 PM (13:00)
                const autoOutTime = new Date();
                autoOutTime.setHours(13, 0, 0, 0); 
                record.outTime = autoOutTime;

                const inTimeSL = new Date(record.inTime).toLocaleString("en-US", { timeZone: "Asia/Colombo" });
                const inHour = new Date(inTimeSL).getHours(); // e.g., 8, 9, 10

                if (inHour < 9) {
                    record.status = "Present";
                } else if (inHour === 9) {
                    record.status = "Late";
                } else {
                    record.status = "Absent";
                }
                
                await record.save();
                console.log(`   -> Auto-checked out ID: ${record.userId} | In: ${inHour}:00 | Status: ${record.status}`);
            }

            console.log("[CRON] Auto Check-Out Complete.");

        } catch (error) {
            console.error("[CRON] Error in auto checkout:", error);
        }
    });
};