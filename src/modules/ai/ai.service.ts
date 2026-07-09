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

        const filters = parsedPromptSchema.parse(JSON.parse(parsedResponse))

        const movies = await movieRepository.searchForAI(filters);

        const recommendation =
            await this.chatWithFallback(
                RECOMMENDATION_PROMPT,
                JSON.stringify({
                    request: userPrompt,
                    movies
                })
            )

        try {
            const result = recommendationSchema.parse(JSON.parse(recommendation))
            await cacheService.set(cacheKey, result, 3600)
            await auditService.logAIRecommendation(true, context);
            return result;
        }
        catch {
            throw new Error(
                "AI returned invalid JSON."
            );
        }
    }

}

export default new AIServices();