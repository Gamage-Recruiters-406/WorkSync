import express from "express";
import colors from 'colors';
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import cors from "cors";

//import announcementRoutes from "./Route/announcement_route.js";

//configure env
dotenv.config();

//database config
connectDB();

const app = express();

//middelwares
app.use(cors())
app.use(express())
app.use(morgan('dev'))
app.use(express.json());

//routes
import announcementRoutes from "./Route/announcement_route.js";

app.use("/api/v1/announcement", announcementRoutes);


//rest api

app.get("/", (req, res) => {
    res.send({
        message: "Welcome to WorkSync"
    })
})


const PORT = process.env.PORT

//run listen
app.listen(PORT, () => {
    console.log(`Server Running on ${process.env.DEV_MODE} mode`.bgCyan.white);
})