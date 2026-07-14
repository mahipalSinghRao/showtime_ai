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
            console.log("1");
            const response = await axios.post(
                `${OLLAMA_URL}/api/chat`,
                {
                    // model: "qwen3:4b",
                    model: "llama3.2:3b",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt,
                        },
                        {
                            role: "user",
                            content: userPrompt,
                        },
                    ],
                    stream: false,
                },
                {
                    timeout: 120000,
                }
            );
           
            return response.data.message.content;
        } catch (error: any) {
            throw new AIProviderError(
                "Ollama",
                error instanceof Error
                    ? error.message
                    : "Unknown Ollama error"
            );
        }

    }

}