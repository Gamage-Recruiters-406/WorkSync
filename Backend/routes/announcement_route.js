import express from "express";
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementbyID,
  getActiveAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
// OR isAdmin — depends on your rule
import { requiredSignIn, isManagerOrAdmin } from "../middlewares/AuthMiddleware.js";
   
  


const AnnouncementRouter = express.Router();


//public routes
AnnouncementRouter.get("/getAnnouncements", getAnnouncements);
AnnouncementRouter.get("/getAnnouncement/:id", getAnnouncementbyID);
AnnouncementRouter.get("/getActiveAnnouncements", getActiveAnnouncements);

//protected routes
AnnouncementRouter.post("/createAnnouncement",requiredSignIn,isManagerOrAdmin,createAnnouncement );   
AnnouncementRouter.put("/updateAnnouncement/:id", requiredSignIn,isManagerOrAdmin,updateAnnouncement);
AnnouncementRouter.delete("/deleteAnnouncement/:id", requiredSignIn,isManagerOrAdmin,deleteAnnouncement);

export default AnnouncementRouter;
