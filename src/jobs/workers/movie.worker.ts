import { bullConnection } from "@/config/bullmq";
import logger from "@/config/logger";
import movieService from "@/modules/movie/movie.service";
import { MovieSyncSource } from "@/modules/movie/movie.types";
import { Job, Worker } from "bullmq";

export const movieWorker = new Worker(
    "movie-sync",

    async (job: Job<{ source: MovieSyncSource, page: number }>) => {

        console.log("================================");
        console.log("WORKER STARTED");

        logger.info(`Movie Sync Started (${job.data.source})`);
        console.log("Sync started", job.data);
        await movieService.syncMovies(job.data.source, job.data.page);
        console.log("Sync finished");
        logger.info(`Movie Sync Completed (${job.data.source})`);
    },
    {
        connection: bullConnection()
    }
);

movieWorker.on("completed", () => {
    logger.info("Movie Sync Completed");
});

movieWorker.on("failed", (job, error) => {
    console.error("❌ Job Failed");
    console.error("Job ID:", job?.id);
    console.error("Job Data:", job?.data);
    console.error("Error:", error);
    console.error("Stack:", error.stack);
});

movieWorker.on("active", (job) => {
    console.log("🚀 Processing Job:", job.id);
});

movieWorker.on("ready", () => {
    console.log("✅ Worker Ready");
});

// movieWorker.on("error", (err) => {
//     console.error("❌ Worker Error:", err);
// });