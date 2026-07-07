import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import errMiddleware from "./shared/middlewares/error.middleware";

import authRoutes from "@/modules/auth/auth.routes"
import userRoutes from "@/modules/user/user.routes"
import movieRoutes from "@/modules/movie/movie.routes"
import reviewRoutes from "@/modules/reviews/review.routes"
import watchlistRoutes from "@/modules/watchlist/watchlist.routes"
import recommendRoutes from "@/modules/ai/ai.routes"
import { swaggerSpec } from "./docs/swagger";

dotenv.config()

const app = express();

app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/movie", movieRoutes)
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/watchlist", watchlistRoutes);
app.use("/api/v1/recommend", recommendRoutes);


app.get("/", (_req, res) => {
    res.json({
        success: true, message: "ShowTime AI Backend Running",
    })
})

app.use(errMiddleware)

export default app