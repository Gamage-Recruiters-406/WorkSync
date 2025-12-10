import express from "express";
import colors from 'colors';
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from "cors";
import projectTeamRoutes from "./routes/projectTeamRoutes.js";

// Configure environment
dotenv.config();

// Database config
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes 
app.use("/api/v1/project-team", projectTeamRoutes);

// Test route
app.get("/", (req, res) => {
    res.send({
        message: "Welcome to WorkSync"
    });
});

const PORT = process.env.PORT || 8090;

// Start server
app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} mode`.bgCyan.white);
});
