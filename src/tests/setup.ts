import mongoose from "mongoose";
import connectDB from "@/config/database";
import { redisClient } from "@/config/redis";
import { bullConnection } from "@/config/bullmq";

const bull = bullConnection();

beforeAll(async () => {
    await connectDB();

    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
});

afterAll(async () => {
    if (bull.status !== "end") {
        await bull.quit();
    }

    if (redisClient.isOpen) {
        await redisClient.quit();
    }

    await mongoose.connection.close();
});