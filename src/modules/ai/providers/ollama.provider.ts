import axios from "axios";
import { AIProvider } from "./ai.provider";
import { OLLAMA_URL } from "@/config/ollama";
import AIProviderError from "../errors/AIProviderError";

export class OllamaProvider implements AIProvider {
    readonly name = "Ollama";
    async chat(
        systemPrompt: string,
        userPrompt: string
    ): Promise<string> {

        try {
            const response =
                await axios.post(
                    `${OLLAMA_URL}/api/generate`,
                    {
                        model: "qwen3:4b",

                        prompt:
                            `${systemPrompt}\n\n${userPrompt}`,

                        stream: false
                    }
                );

            return response.data.response;
        } catch (error) {
            throw new AIProviderError(
                "Ollama",
                error instanceof Error
                    ? error.message
                    : "Unknown Ollama error"
            );
        }

    }

}