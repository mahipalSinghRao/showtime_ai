import crypto from "crypto";

export const generateAICacheKey = (prompt: string) => {
    const hash = crypto
        .createHash("sha256")
        .update(prompt.trim().toLowerCase())
        .digest("hex");

    return `ai:${hash}`;
}