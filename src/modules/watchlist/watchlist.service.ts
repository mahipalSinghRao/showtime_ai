import ApiError from "@/shared/errors/ApiError";
import watchlistRepository from "./watchlist.repository";
import { CreateWatchlistDto } from "./watchlist.types";

class WatchlistService {
    async addToWatchlist(data: CreateWatchlistDto) {
        const exists =
            await watchlistRepository.findOne(
                data.user.toString(),
                data.movie.toString()
            );

        if (exists) {
            throw new ApiError(
                409,
                "Movie already exists in watchlist"
            );
        }
        return watchlistRepository.create(data)
    }

    async getUserWatchlist(userId: string) {
        return watchlistRepository.findByUser(userId)
    }

    async removeFromWatchlist(userId: string, movieId: string) {
        return watchlistRepository.remove(userId, movieId)
    }
}

export default new WatchlistService()