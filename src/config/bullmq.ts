import IORedis from "ioredis";
import { env } from "./env";
import logger from "./logger";

let connection: IORedis | null = null;


export function bullConnection() {
    if (!connection) {
        connection = new IORedis(env.REDIS_URL, {
            maxRetriesPerRequest: null,
        });
    }

    connection.on("connect", () => {
        logger.info("BullMQ Redis Connected");
    });

    connection.on("error", (err) => {
        logger.error("BullMQ Redis Error", err);
    });

    return connection;
}

// bullConnection.on("connect", () => {
//     logger.info("BullMQ Redis Connected");
// });

// bullConnection.on("error", (err) => {
//     logger.error("BullMQ Redis Error", err);
// });