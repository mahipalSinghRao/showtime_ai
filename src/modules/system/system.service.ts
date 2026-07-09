import os from "os";
import mongoose from "mongoose";
import { redisClient } from "@/config/redis";
import { env } from "@/config/env";
import { Movie } from "@/modules/movie/movie.model";
import { User } from "@/modules/user/user.model";
import { Review } from "@/modules/reviews/review.model";


class SystemService {
    async health() {
        return {
            status: "OK",
            uptime: process.uptime(),
            timestamp: new Date().toISOString()
        };
    }

    async ready() {
        return {
            mongo: mongoose.connection.readyState === 1,
            redis: redisClient.isOpen
        };
    }

    async version() {
        return {
            app: "ShowTime AI Backend",
            version: "1.0.0",
            node: process.version,
            environment: env.NODE_ENV
        };
    }

    async metrics() {
        const [totalMovies, totalUsers, totalReviews] = await Promise.all([
            Movie.countDocuments(),
            User.countDocuments(),
            Review.countDocuments(),
        ])
        return {
            database: {
                mongo: mongoose.connection.readyState === 1,
                redis: redisClient.isOpen
            },
            collections: {
                movies: totalMovies,
                users: totalUsers,
                reviews: totalReviews
            },
            system: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                cpu: os.loadavg(),
                platform: process.platform,
                node: process.version,
                hostname: os.hostname()
            }
        }
    }
}

export default new SystemService();