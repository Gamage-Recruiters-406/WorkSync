import express from "express";
import colors from 'colors';
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from "cors";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";


//configure env
dotenv.config();

//database config
connectDB();

const app = express();

//middelwares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/userAuth", userRoutes);

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