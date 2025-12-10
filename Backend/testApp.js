import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from "cors";
import leaveRoutes from "./routes/leaveRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Configure environment
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes (only what we need for testing)
app.use("/api/v1/leave-request", leaveRoutes);
app.use("/api/v1/userAuth", userRoutes);

// Simple test route
app.get("/", (req, res) => {
  res.send({
    message: "WorkSync Test Server",
  });
});

// Export the app without starting the server
export default app;

