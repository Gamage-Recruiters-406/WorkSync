import express from "express";
import colors from 'colors';
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from "cors";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import announcementRoutes from "./routes/announcement_route.js";
import cookieParser from "cookie-parser";

//configure env
dotenv.config();

//database config
connectDB();

const app = express();

//middelwares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser());

//routes
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/leave-request", leaveRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/userAuth", userRoutes);
app.use("/api/v1/department", departmentRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/announcement", announcementRoutes);


app.get("/", (req, res) => {
    res.send({
        message: "Welcome to WorkSync"
    })
})

const PORT = process.env.PORT

//run listen
app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} mode`.bgCyan.white);
    console.log(`Server is running on port ${PORT}`.bgCyan.white)
})