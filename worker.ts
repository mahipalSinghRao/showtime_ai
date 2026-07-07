import { connectDB } from "@/config/database";
import { redisClient } from "@/config/redis";
import "@/jobs/workers/movie.worker";

async function startWorker() {
    await connectDB();
    await redisClient.connect();
}

startWorker();