export default class AIProviderError extends Error {
    readonly provider: string;

    constructor(provider: string, message: string) {
        super(message);

        this.provider = provider;
        this.name = "AIProviderError";
    }
}