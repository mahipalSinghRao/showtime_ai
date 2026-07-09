export interface AIProvider {
    readonly name: string;
    chat(
        systemPrompt: string,
        userPrompt: string
    ): Promise<string>;

}