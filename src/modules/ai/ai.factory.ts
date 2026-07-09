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

    private readonly providers: Record<AIProviderType, AIProvider> = {
        [AIProviderType.OPENAI]: new OpenAIProvider(),
        [AIProviderType.GEMINI]: new GeminiProvider(),
        [AIProviderType.OLLAMA]: new OllamaProvider(),
    };

    getProvider(provider?: AIProviderType): AIProvider {

        const selected =
            (provider ??
                env.AI_PROVIDER) as AIProviderType;

        return this.providers[selected];
    }

    getFallbackChain(provider?: AIProviderType): AIProvider[] {

        const selected =
            (provider ??
                env.AI_PROVIDER) as AIProviderType;

        switch (selected) {

            case AIProviderType.OPENAI:
                return [
                    this.providers.openai,
                    this.providers.gemini,
                    this.providers.ollama
                ];

            case AIProviderType.GEMINI:
                return [
                    this.providers.gemini,
                    this.providers.openai,
                    this.providers.ollama
                ];

            case AIProviderType.OLLAMA:
                return [
                    this.providers.ollama,
                    this.providers.gemini,
                    this.providers.openai
                ];

            default:
                return [
                    this.providers.gemini,
                    this.providers.openai,
                    this.providers.ollama
                ];
        }

    }

}

export default new AIProviderFactory();