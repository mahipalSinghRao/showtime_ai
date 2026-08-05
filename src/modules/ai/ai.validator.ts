import z from "zod";

export const parsedPromptSchema = z.object({
    genres: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
    language: z.string().optional(),
    year: z.number().optional(),
    mood: z.string().optional(),
})

export const recommendationSchema = z.object({
    recommendations: z.array(
        z.object({
            tmdbId: z.number(),
            reason: z.string()
        })
    )
});