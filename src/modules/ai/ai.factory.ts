import { env } from "@/config/env";
import { AIProvider } from "./providers/ai.provider";
import { OpenAIProvider } from "./providers/openai.provider";
import { GeminiProvider } from "./providers/gemini.provider";
import { OllamaProvider } from "./providers/ollama.provider";

export enum AIProviderType {
    OLLAMA = "ollama",
    GEMINI = "gemini",
    OPENAI = "openai",
}

class AIProviderFactory {

    private createProvider(type: AIProviderType): AIProvider {

        switch (type) {

            case AIProviderType.OLLAMA:
                return new OllamaProvider();

            case AIProviderType.GEMINI:
                return new GeminiProvider();

            case AIProviderType.OPENAI:
                return new OpenAIProvider();

            default:
                throw new Error("Provider disabled");
        }
    }

    getProvider(provider?: AIProviderType): AIProvider {

        return this.createProvider(
            (provider ?? env.AI_PROVIDER) as AIProviderType
        );
    }

    getFallbackChain(provider?: AIProviderType): AIProvider[] {

        const selected =
            (provider ?? env.AI_PROVIDER) as AIProviderType;

        switch (selected) {

            case AIProviderType.OLLAMA:
                return [
                    this.createProvider(AIProviderType.OLLAMA),
                    this.createProvider(AIProviderType.GEMINI),
                    this.createProvider(AIProviderType.OPENAI)
                ];

            case AIProviderType.GEMINI:
                return [
                    this.createProvider(AIProviderType.GEMINI),
                    this.createProvider(AIProviderType.OPENAI),
                    this.createProvider(AIProviderType.OLLAMA)
                ];

            case AIProviderType.OPENAI:
                return [
                    this.createProvider(AIProviderType.OPENAI),
                    this.createProvider(AIProviderType.GEMINI),
                    this.createProvider(AIProviderType.OLLAMA)
                ];

            default:
                return [
                    this.createProvider(AIProviderType.OLLAMA),
                    this.createProvider(AIProviderType.GEMINI),
                    this.createProvider(AIProviderType.OPENAI)
                ];
        }
    }
}


export default new AIProviderFactory();