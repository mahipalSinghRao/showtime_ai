import z from "zod";

export const movieQuerySchema = z.object({
    query: z.object({
        page: z.coerce.number().min(1).default(1),
        limit: z.coerce.number().min(1).max(50).default(20),
        search: z.string().optional(),
        genres: z.string().optional(),
        originalLanguage: z.string().optional(),
        isFeatured: z.coerce.boolean().optional(),
        isTrending: z.coerce.boolean().optional(),
        sort: z.enum([
            "voteAverage",
            "releaseDate",
            "title",
            "popularity"
        ]).optional(),
    })
})