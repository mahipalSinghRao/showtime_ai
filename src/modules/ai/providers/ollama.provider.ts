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
            const prompt = [
                systemPrompt,
                "",
                userPrompt
            ].join("\n");
            const response = await axios.post(
                `${OLLAMA_URL}/api/generate`,
                {
                    model: "llama3.2:3b",
                    prompt,
                    stream: false,
                    format: "json",
                },
                {
                    timeout: 120000
                }
            );


            return response.data.response;

        } catch (error: any) {
            console.error("❌ Ollama request failed:", {
                url: `${OLLAMA_URL}/api/generate`,
                message: error?.message,
                code: error?.code,
                response: error?.response?.data,
            });

            throw new AIProviderError(
                "Ollama",
                error instanceof Error
                    ? error.message
                    : "Unknown Ollama error"
            );
        }

    }

}