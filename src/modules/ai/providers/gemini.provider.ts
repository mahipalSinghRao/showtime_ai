import { gemini } from "@/config/gemini";
import { AIProvider } from "./ai.provider";
import AIProviderError from "../errors/AIProviderError";

export class GeminiProvider implements AIProvider {
    readonly name = "Gemini";
    async chat(
        systemPrompt: string,
        userPrompt: string
    ): Promise<string> {
        try {
            const response = await gemini.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `${systemPrompt}\n\n${userPrompt}`
            })
            return response.text ?? "";
        } catch (error) {
            throw new AIProviderError(
                "Gemini",
                error instanceof Error
                    ? error.message
                    : "Unknown Gemini error"
            );
        }
    }
}