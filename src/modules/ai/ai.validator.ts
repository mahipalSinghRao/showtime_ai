import z from "zod";

export const parsedPromptSchema = z.object({
    genres: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
    language: z.string().optional(),
    year: z.number().optional(),
    mood: z.string().optional(),
})

export const recommendationSchema = z.object({
    title: z.string(),
    reason: z.string(),
    recommendations: z.array(
        z.object({
            title: z.string(),
            overview: z.string(),
            genres: z.array(z.string()),
            voteAverage: z.number(),
            releaseDate: z.string().or(z.date()),
            posterPath: z.string()
        })
    )
})