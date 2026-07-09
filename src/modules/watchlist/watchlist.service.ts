import ApiError from "@/shared/errors/ApiError";
import watchlistRepository from "./watchlist.repository";
import { CreateWatchlistDto } from "./watchlist.types";
import auditService from "../audit/audit.service";
import { RequestContext } from "@/shared/context/request-context";

class WatchlistService {
    async addToWatchlist(
        data: CreateWatchlistDto,
        context?: RequestContext
    ) {
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
        const watchlist = await watchlistRepository.create(data);

        await auditService.logWatchlistAdd(true, context);

        return watchlist;
    }

    async getUserWatchlist(userId: string) {
        return watchlistRepository.findByUser(userId)
    }

    async removeFromWatchlist(userId: string,
        movieId: string,
        context?: RequestContext
    ) {
        const result = await watchlistRepository.remove(userId, movieId)
        await auditService.logWatchlistRemove(
            true,
            context
        );
        return result;
    }
}

export default new WatchlistService()