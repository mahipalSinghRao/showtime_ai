import dns from "dns";
dns.setServers([
    "8.8.8.8",
    "8.8.4.4",
]);
import app from "./app";
import connectDB from "@/config/database";
import { env } from "./config/env"
import { redisClient } from "./config/redis";
import "@/jobs/workers/movie.worker";
import { adminSeed } from "./modules/seeds/admin.seed";

async function startServer() {
    try {
        await connectDB();

        await redisClient.connect();

        await adminSeed();

        const PORT = Number(env.PORT) || 5000;

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server Running on ${PORT}`);
        });

    } catch (error) {
        console.error("❌ Server startup failed:", error);
        process.exit(1);
    }
}
startServer()