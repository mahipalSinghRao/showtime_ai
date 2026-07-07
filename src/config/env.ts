import dotenv from "dotenv"
dotenv.config()

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",

    PORT: process.env.PORT || 5000,

    MONGODB_URI: process.env.MONGODB_URI || "",

    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "",

    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "",

    REDIS_URL: process.env.REDIS_URL || "",

    OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",

    GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",

    OLLAMA_URL: process.env.OLLAMA_URL || "",

    TMDB_API_KEY: process.env.TMDB_API_KEY || "",
}