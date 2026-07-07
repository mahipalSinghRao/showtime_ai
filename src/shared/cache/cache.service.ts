import { redisClient } from "@/config/redis";

class CacheService {
    async get<T>(key: string): Promise<T | null> {
        const value = await redisClient.get(key);
        if (!value) {
            return null;
        }
        return JSON.parse(value) as T;
    }

    async set(key: string,
        value: unknown,
        ttl = 300) {
        await redisClient.set(key, JSON.stringify(value), { EX: ttl })
    }

    async del(key: string) {
        await redisClient.del(key)
    }

    async deleteByPattern(pattern: string) {
        const keys = await redisClient.keys(pattern);
        if (!keys.length) {
            return;
        }

        await redisClient.del(keys);
    }
}

export default new CacheService();