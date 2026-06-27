import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import errMiddleware from "./shared/middlewares/error.middleware";

import authRoutes from "@/modules/auth/auth.routes"

dotenv.config()

const app = express();

app.use(express.json())
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes)

app.use(errMiddleware)

app.get("/", (req, res) => {
    res.json({
        success: true, message: "ShowTime AI Backend Running",
    })
})

export default app