import app from "@/app";
import { connectDB } from "@/config/database";
import { env } from "@/config/env"
import logger from "@/config/logger";
import { redisClient } from "./config/redis";


const startServer = async () => {
    try {
        // const PORT = Number(process.env.PORT) || 5000;
        await connectDB()
        await redisClient.connect();
        app.listen(env.PORT, () => {
            console.log(`Server Running on port: ${env.PORT}`);
        })
    } catch (error) {
        console.error("Startup Error:", error);

        if (error instanceof Error) {
            logger.error(error.message);
            logger.error(error.stack);
            // logger.error("Failed to connect Redis", error);
        }

        process.exit(1);
    }
}
startServer()