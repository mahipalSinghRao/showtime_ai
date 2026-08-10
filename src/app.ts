import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";

import errMiddleware from "./shared/middlewares/error.middleware";

import authRoutes from "@/modules/auth/auth.routes"
import userRoutes from "@/modules/user/user.routes"
import movieRoutes from "@/modules/movie/movie.routes"
import reviewRoutes from "@/modules/reviews/review.routes"
import watchlistRoutes from "@/modules/watchlist/watchlist.routes"
import recommendRoutes from "@/modules/ai/ai.routes"
import systemRoutes from "@/modules/system/system.routes";
import { swaggerSpec } from "./docs/swagger";
import { aiLimiter, apiLimiter, authLimiter } from "@/shared/middlewares/rateLimit.middleware";
import { env } from "./config/env";
import { requestId } from "./shared/middlewares/requestId.middleware";
import { requestLoggerMiddleware } from "./shared/middlewares/requestLogger.middleware";

dotenv.config()

const app = express();

app.set("trust proxy", 1);

app.use(helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
}));
app.use(
    cors({
        origin: process.env.NODE_ENV === "production"
            ? env.CLIENT_URL
            : env.DOMIN_URL,

        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
app.use(compression());
app.use(requestId);
app.use(requestLoggerMiddleware)
app.use(morgan("dev"));
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/", systemRoutes);
app.use("/api/v1/auth", authLimiter, authRoutes)
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/movies", movieRoutes)
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/watchlist", watchlistRoutes);
app.use("/api/v1/ai", aiLimiter, recommendRoutes);


app.get("/", (_req, res) => {
    res.json({
        success: true, message: "ShowTime AI Backend Running",
    })
})

app.use(errMiddleware)

export default app