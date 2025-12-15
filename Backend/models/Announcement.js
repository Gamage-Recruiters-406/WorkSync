import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    announcementId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: false,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    audience: {
      type: String,
      enum: ["Manager", "Admin", "Employee","All"],
      default: "All",
    },

    // Additional Options
    isPinned: {
       type: Boolean,
       default: false },

    notifyAll: {
       type: Boolean,
        default: false 
      },

    // likes
    likes: [
      { type: mongoose.Schema.Types.ObjectId,
         ref: "User" }],
    likesCount: {
       type: Number,
        default: 0 
      },

  
    isActive: {
      type: Boolean,
      default: true,
    },

  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Announcement", announcementSchema);
