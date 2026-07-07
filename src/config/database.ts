import mongoose from "mongoose"
import { env } from "./env"
import logger from "./logger"

const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI);
        logger.info("✅ MongoDB Connected");
    } catch (error) {
        logger.error("❌ MongoDB Connection Failed");

        if (error instanceof Error) {
            logger.error(error.message);
        }

        throw error;
    }
};

export default connectDB;
