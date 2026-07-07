import { openai } from "@/config/openai";
import { AIProvider } from "./ai.provider";

export class OpenAIProvider implements AIProvider {

    async chat(
        systemPrompt: string,
        userPrompt: string
    ): Promise<string> {

        const response =
            await openai.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [
                    {
                        role: "system",
                        content: systemPrompt
                    },

                    {
                        role: "user",
                        content: userPrompt
                    }
                ]
            });
            
        return response.choices[0].message.content ?? "";
    }

}