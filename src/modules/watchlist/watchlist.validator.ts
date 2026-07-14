import z from "zod";

export const createWatchlistSchema = z.object({
    body: z.object({
        movie: z.string()
    })
});