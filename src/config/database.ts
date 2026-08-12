import mongoose from "mongoose"
import { env } from "./env"
import logger from "./logger"

const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        logger.info("✅ MongoDB Connected");

    } catch (error) {
        console.log(
            "MongoDB URL:",
            new URL(env.MONGODB_URI).hostname
        );
        logger.error("❌ MongoDB Connection Failed");

        if (error instanceof Error) {
            logger.error(error.message);
        }

        throw error;
    }
};

export default connectDB;
