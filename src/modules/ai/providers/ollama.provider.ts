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
            // console.log("1");
            // const response = await axios.post(
            //     `${OLLAMA_URL}/api/chat`,
            //     {
            //         model: "qwen3:4b",
            //         format: "json",
            //         messages: [
            //             {
            //                 role: "system",
            //                 content: "You are a helpful assistant. Respond ONLY with valid JSON."
            //             },
            //             {
            //                 role: "user",
            //                 content: userPrompt + "\n\nDo not think. Respond immediately with JSON only."
            //             }
            //         ],
            //         stream: false,
            //     },
            //     {
            //         timeout: 120000,
            //     }
            // );

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
            throw new AIProviderError(
                "Ollama",
                error instanceof Error
                    ? error.message
                    : "Unknown Ollama error"
            );
        }

    }

}