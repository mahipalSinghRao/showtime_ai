import { Watchlist } from "./watchlist.model";
import { CreateWatchlistDto } from "./watchlist.types";

class WatchlistRepository {
    async create(data: CreateWatchlistDto) {
        return Watchlist.create(data)
    }

    async findByUser(userId: string) {
        const watchlist = Watchlist.find({ user: userId })
            .populate({
                path: "movie",
                select: "title posterPath voteAverage releaseDate"
            })
            .sort({ createdAt: -1 })
            .lean();
        return watchlist;
    }

    async remove(userId: string, movieId: string) {
        return Watchlist.findOneAndDelete({
            user: userId, movie: movieId
        })
    }

    async findOne(userId: string, movieId: string) {
        return Watchlist.findOne({
            user: userId,
            movie: movieId
        });

    }
}

export default new WatchlistRepository();