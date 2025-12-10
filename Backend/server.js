// Backend/server.js
import colors from "colors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";

// Configure environment
dotenv.config();

// Database config
connectDB();

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} mode`.bgCyan.white);
  console.log(`Server is running on port ${PORT}`.bgCyan.white);
});
