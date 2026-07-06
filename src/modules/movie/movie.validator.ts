import z from "zod";

export const movieQuerySchema = z.object({
    query: z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(50).default(1),
        search: z.string().optional(),
        sort: z.enum([
            "voteAverage",
            "releaseDate",
            "title",
            "popularity"
        ]).optional()
    })
})