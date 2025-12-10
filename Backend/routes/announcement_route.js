import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementbyID,
  getActiveAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

const AnnouncementRouter = express.Router();

AnnouncementRouter.post("/createAnnouncement", createAnnouncement);
AnnouncementRouter.get("/getAnnouncements", getAnnouncements);
AnnouncementRouter.get("/getAnnouncement/:id", getAnnouncementbyID);
AnnouncementRouter.get("/getActiveAnnouncements", getActiveAnnouncements);
AnnouncementRouter.put("/updateAnnouncement/:id", updateAnnouncement);
AnnouncementRouter.delete("/deleteAnnouncement/:id", deleteAnnouncement);

export default AnnouncementRouter;
