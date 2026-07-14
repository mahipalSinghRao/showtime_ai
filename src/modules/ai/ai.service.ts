import logger from "@/config/logger";
import movieRepository from "../movie/movie.repository";
import aiFactory from "./ai.factory";
import { PARSE_PROMPT } from "./ai.prompts";
import { RECOMMENDATION_PROMPT } from "./prompts/recommendation.prompt";
import { parsedPromptSchema, recommendationSchema } from "./ai.validator";
import { generateAICacheKey } from "./ai.cache";
import cacheService from "@/shared/cache/cache.service";
import auditService from "../audit/audit.service";
import { RequestContext } from "@/shared/context/request-context";

export function extractJSON(text: string) {
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
        throw new Error("No JSON found");
    }

    return JSON.parse(match[0]);
}

class AIServices {
    private async chatWithFallback(
        systemPrompt: string,
        userPrompt: string
    ): Promise<string> {
        const providers = aiFactory.getFallbackChain();
        let lastError: unknown;

        for (const provider of providers) {
            try {
                logger.info(`Using AI Provider: ${provider.name}`);
                return await provider.chat(
                    systemPrompt,
                    userPrompt
                );
            } catch (error) {
                logger.warn(`${provider.name} failed. Trying next provider...`);
                lastError = error;
                console.error(
                    `[${provider.name}]`,
                    error
                );

                lastError = error;
            }
        }
        throw lastError;
    }

    async recommend(userPrompt: string, context?: RequestContext) {
        const cacheKey = generateAICacheKey(userPrompt);

        const cached = await cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }

        const parsedResponse = await this.chatWithFallback(PARSE_PROMPT, userPrompt)
     
        const raw = extractJSON(parsedResponse);

        const normalized = {
            ...raw,
            language: raw.language ?? undefined,
            mood: raw.mood ?? undefined,
            year: raw.year ?? undefined,
        };

        const filters = parsedPromptSchema.parse(normalized);

        const movies = await movieRepository.searchForAI(filters);
        console.log("MOVIES FOUND:", movies.length);
        if (movies.length === 0) {
            return {
                title: "No movies found",
                reason: "No movies matched your filters.",
                recommendations: [],
            };
        }
        const recommendation =
            await this.chatWithFallback(
                RECOMMENDATION_PROMPT,
                JSON.stringify({
                    request: userPrompt,
                    movies
                })
            )

        try {
            const result = recommendationSchema.parse(extractJSON(recommendation))
            const enrichedRecommendations = [];

            for (const item of result.recommendations) {

                const movie =
                    movies.find(
                        m =>
                            m.title.toLowerCase() ===
                            item.title.toLowerCase()
                    );

                if (movie) {

                    enrichedRecommendations.push({
                        ...movie,
                        reason: item.reason
                    });

                }

            }
            await cacheService.set(cacheKey, result, 3600)
            await auditService.logAIRecommendation(true, context);
            return {
                recommendations: enrichedRecommendations
            };
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            }

            throw error;
        }
    }

}

export default new AIServices();