import app from "./app";
import connectDB  from "@/config/database";
import { env } from "./config/env"
import { redisClient } from "./config/redis";
import "@/jobs/workers/movie.worker";

async function startServer() {
    await connectDB();
    await redisClient.connect();

    app.listen(env.PORT, () => {
        console.log(`Server Running on ${env.PORT}`);
    });
}
startServer()