export interface AIProvider {
    chat(
        systemPrompt: string,
        userPrompt: string
    ): Promise<string>;

}