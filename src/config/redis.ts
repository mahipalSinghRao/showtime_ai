import { createClient } from "redis";
import { env } from "./env";
import logger from "./logger";

export const redisClient = createClient({
    url: env.REDIS_URL
})

redisClient.on("connect", () => {
    logger.info("Redis Connected");
});

redisClient.on("error", (err) => {
    logger.error("Redis Error", err);
})