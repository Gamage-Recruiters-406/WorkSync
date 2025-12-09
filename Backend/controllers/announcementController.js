import Announcement from "../models/Announcement.js";
import { v4 as uuidv4 } from "uuid";

//import { IsAddmin } from "../";

let IsAdmin = false;

// Create Announcement
export async function createAnnouncement(req, res) {
 
  if (!IsAdmin) { // check user is admin or not
    res.status(401).json({
      message: "user not found please logging or use admin loging",
    });
    return;
  }

  try {
    const { title, date, message, isActive } = req.body;

    const newAnnouncement = await Announcement.create({
      announcementId: uuidv4(),
      title,
      date,
      message,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      data: newAnnouncement,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Get All Announcements
export async function getAnnouncements(req, res) {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Get Announcement by ID
export async function getAnnouncementbyID(req, res) {

  try {
    const AId = req.params;
    const announcement = await Announcement.findOne({announcementId: AId.id });

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Get Recent / Active Announcements
export async function getActiveAnnouncements(req, res) {
  try {
    const announcements = await Announcement.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Update Announcement
export async function updateAnnouncement(req, res) {

  if (!IsAdmin) { // check user is admin or not
    res.status(401).json({
      message: "user not found please logging or use admin loging",
    });
    return;
  }
  try {
    const  Aid  = req.params;
       console.log("recived id",Aid.id);
    const updated = await Announcement.findOneAndUpdate(
      { announcementId: Aid.id }, req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

// Delete Announcement
export async function deleteAnnouncement(req, res) {

  if (!IsAdmin) { // check user is admin or not
    res.status(401).json({
      message: "user not found please logging or use admin loging",
    });
    return;
  }
  
  try {
    const { id } = req.params;

    const deleted = await Announcement.findOneAndDelete({
      announcementId: id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
