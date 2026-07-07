import { bullConnection } from "@/config/bullmq";
import logger from "@/config/logger";
import movieService from "@/modules/movie/movie.service";
import { Worker } from "bullmq";

export const movieWorker = new Worker(
    "movie-sync",
    async (_job) => {
        logger.info("Movie Sync Started");
        await movieService.syncMovies();
        logger.info("Movie Sync Completed");
    },
    {
        connection: bullConnection()
    }
);

movieWorker.on("completed", () => {
    logger.info("Movie Sync Completed");
});

movieWorker.on("failed", (_, error) => {
    logger.error("Movie Sync Failed", error);
});