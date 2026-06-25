import mongoose from "mongoose"
import { env } from "./env"
import logger from "./logger"

export const connectDB = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI)
        logger.info("✅ MongoDB Connected")
    } catch (error) {
        logger.error("❌ MongoDB Connection Failed");

        if (error instanceof Error) {
            logger.error(error.message);
            logger.error(error.stack);
        } else {
            logger.error(String(error));
        }

        process.exit(1);
    }
}


// import mongoose from "mongoose";
// import { env } from "./env";

// export const connectDB = async () => {
//     console.log("Connecting to:", env.MONGODB_URI);

//     await mongoose.connect(env.MONGODB_URI);

//     console.log("MongoDB Connected Successfully");
// };