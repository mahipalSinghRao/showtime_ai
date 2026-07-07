import movieRepository from "../movie/movie.repository";
import { aiProvider } from "@/config/ai";
import { PARSE_PROMPT } from "./ai.prompts";
import { RECOMMENDATION_PROMPT } from "./prompts/recommendation.prompt";

class AIServices {

    async recommend(userPrompt: string) {
        // STEP 1 - Parse user prompt
        const parsedResponse = await aiProvider.chat(
            PARSE_PROMPT,
            userPrompt
        );

        const filters = JSON.parse(parsedResponse);

        const movies = await movieRepository.searchForAI(filters);

        const recommendation =
            await aiProvider.chat(
                RECOMMENDATION_PROMPT,
                JSON.stringify({
                    request: userPrompt,
                    movies
                })
            );

        try {
            return JSON.parse(recommendation);
        }
        catch {
            throw new Error(
                "AI returned invalid JSON."
            );
        }
    }

}

export default new AIServices();