import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementbyID,
  getActiveAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

import { requiredSignIn, isAdmin, isManager } from "../middlewares/AuthMiddleware.js";
   // OR isAdmin — depends on your rule
  


const AnnouncementRouter = express.Router();


//public routes
AnnouncementRouter.get("/getAnnouncements", getAnnouncements);
AnnouncementRouter.get("/getAnnouncement/:id", getAnnouncementbyID);
AnnouncementRouter.get("/getActiveAnnouncements", getActiveAnnouncements);

//protected routes
AnnouncementRouter.post("/createAnnouncement",requiredSignIn,isManager,createAnnouncement );   
AnnouncementRouter.put("/updateAnnouncement/:id", updateAnnouncement);
AnnouncementRouter.delete("/deleteAnnouncement/:id", deleteAnnouncement);

export default AnnouncementRouter;
