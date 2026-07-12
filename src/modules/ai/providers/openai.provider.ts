import { getOpenAIClient } from "@/config/openai";
import { AIProvider } from "./ai.provider";
import AIProviderError from "../errors/AIProviderError";

export class OpenAIProvider implements AIProvider {
    readonly name = "OpenAI";
    async chat(
        systemPrompt: string,
        userPrompt: string
    ): Promise<string> {

        try {
            const response =
                await getOpenAIClient()
                    .chat
                    .completions
                    .create({
                        model: "gpt-4.1-mini",
                        messages: [
                            {
                                role: "system",
                                content: systemPrompt
                            },

                            {
                                role: "user",
                                content: userPrompt
                            }
                        ]
                    });

            return response.choices[0].message.content ?? "";
        } catch (error) {
            throw new AIProviderError(
                "OpenAI",
                error instanceof Error
                    ? error.message
                    : "Unknown OpenAI error"
            );
        }
    }

}