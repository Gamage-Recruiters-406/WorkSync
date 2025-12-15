import express from "express";
import {
  createAnnouncement,

  getManagerAnnouncements,
  getEmployeeAnnouncements,
  getAdminAnnouncements,
  getAllAnnouncements,

  getAnnouncementbyID,
  getActiveAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
// OR isAdmin — depends on your rule
import { requiredSignIn, isManagerOrAdmin,isEmployee } from "../middlewares/AuthMiddleware.js";
   
  


const AnnouncementRouter = express.Router();

//user specific get routes

AnnouncementRouter.get("/getEmployeeAnnouncements", getEmployeeAnnouncements);
AnnouncementRouter.get("/getManagerAnnouncements", getManagerAnnouncements);
AnnouncementRouter.get("/getAdminAnnouncements", getAdminAnnouncements);
AnnouncementRouter.get("/getAnnouncements", getAllAnnouncements);


//public routes
AnnouncementRouter.get("/getAnnouncement/:id", getAnnouncementbyID);
AnnouncementRouter.get("/getActiveAnnouncements", getActiveAnnouncements);

//protected routes
AnnouncementRouter.post("/createAnnouncement",requiredSignIn,isManagerOrAdmin,createAnnouncement );   
AnnouncementRouter.put("/updateAnnouncement/:id", requiredSignIn,isManagerOrAdmin,updateAnnouncement);
AnnouncementRouter.delete("/deleteAnnouncement/:id", requiredSignIn,isManagerOrAdmin,deleteAnnouncement);

export default AnnouncementRouter;
