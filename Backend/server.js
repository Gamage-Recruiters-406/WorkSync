import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
// import app from "./app.js";
import morgan from "morgan";
import cors from "cors";
import projectTeamRoutes from "./routes/projectTeamRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import announcementRoutes from "./routes/announcement_route.js";
import cookieParser from "cookie-parser";
import milestoneRoutes from "./routes/milestoneRoute.js";
import { startAutoCheckoutJob } from "./helpers/autoCheckoutHelper.js";


// Configure environment
dotenv.config();

// Database config
connectDB();

const app = express();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

//routes
app.use("/api/v1/userAuth", userRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/leave-request", leaveRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/department", departmentRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/announcement", announcementRoutes);
app.use("/api/v1/project-team", projectTeamRoutes);
app.use("/api/v1/millestone", milestoneRoutes);



app.get("/", (req, res) => {
    res.send({
        message: "Welcome to WorkSync"
    });
});


// For Auto-Checkout Timer
startAutoCheckoutJob(); 

const PORT = process.env.PORT || 8090;

app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} mode`.bgCyan.white);
    console.log(`Server is running on port ${PORT}`.bgCyan.white)
});