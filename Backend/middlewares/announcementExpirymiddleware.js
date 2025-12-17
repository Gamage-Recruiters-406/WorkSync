import Announcement from "../models/Announcement.js";

export const autoDeleteExpiredAnnouncements = async () => {
  const now = new Date();

  try {
    const result = await Announcement.deleteMany({
      neverExpire: false,
      endDate: { $lt: now },
    });

    if (result.deletedCount > 0) {
      console.log(` Auto-deleted ${result.deletedCount} expired announcements`);
    }
  } catch (error) {
    console.error("Expiry cleanup failed:", error.message);
  }
};
