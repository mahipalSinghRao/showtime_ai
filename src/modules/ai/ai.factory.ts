import { env } from "@/config/env";
import { AIProvider } from "./providers/ai.provider";
import { OpenAIProvider } from "./providers/openai.provider";
import { GeminiProvider } from "./providers/gemini.provider";
import { OllamaProvider } from "./providers/ollama.provider";

export enum AIProviderType {
    OPENAI = "openai",
    GEMINI = "gemini",
    OLLAMA = "ollama",
}

class AIProviderFactory {

    private createProvider(type: AIProviderType): AIProvider {

        switch (type) {

            case AIProviderType.OPENAI:
                return new OpenAIProvider();

            case AIProviderType.GEMINI:
                return new GeminiProvider();

            case AIProviderType.OLLAMA:
                return new OllamaProvider();
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

            case AIProviderType.OPENAI:
                return [
                    this.createProvider(AIProviderType.OPENAI),
                    this.createProvider(AIProviderType.GEMINI),
                    this.createProvider(AIProviderType.OLLAMA)
                ];

            case AIProviderType.GEMINI:
                return [
                    this.createProvider(AIProviderType.GEMINI),
                    this.createProvider(AIProviderType.OPENAI),
                    this.createProvider(AIProviderType.OLLAMA)
                ];

            case AIProviderType.OLLAMA:
                return [
                    this.createProvider(AIProviderType.OLLAMA),
                    this.createProvider(AIProviderType.GEMINI),
                    this.createProvider(AIProviderType.OPENAI)
                ];

            default:
                return [
                    this.createProvider(AIProviderType.GEMINI),
                    this.createProvider(AIProviderType.OPENAI),
                    this.createProvider(AIProviderType.OLLAMA)
                ];
        }
    }
}

export default new AIProviderFactory();