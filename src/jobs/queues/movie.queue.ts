import { Queue } from "bullmq";
import { bullConnection } from "@/config/bullmq";

let movieQueue: Queue | null = null;

// export function getMovieQueue() {
//     if (!movieQueue) {
//         movieQueue = new Queue("movie-sync", {
//             connection: bullConnection,
//         });
//     }

//     return movieQueue;
// }


export function getMovieQueue() {
    if (!movieQueue) {
        movieQueue = new Queue("movie-sync", {
            connection: bullConnection(),
        });
    }

    return movieQueue;
}