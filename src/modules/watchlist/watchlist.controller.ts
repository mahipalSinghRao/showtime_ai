import asyncHandler from "@/shared/utils/asyncHandler";
import watchlistService from "./watchlist.service";
import ApiResponse from "@/shared/utils/ApiResponse";

class WatchlistController {
    createWatchlist = asyncHandler(async (req, res) => {
        const result = await watchlistService.addToWatchlist({
            movie: req.body.movie,
            user: req.user.userId
        })
        return res.status(201).json(
            new ApiResponse(
                201,
                "Movie added to watchlist",
                result
            )
        );
    })

    getWatchlist = asyncHandler(async (req, res) => {
        const result = await watchlistService.getUserWatchlist(req.user.userId);
        return res.status(200).json(
            new ApiResponse(
                200,
                "Watchlist fetched successfully",
                result
            )
        );
    })

    removeWatchlist = asyncHandler(async (req, res) => {

        await watchlistService.removeFromWatchlist(
            req.user.userId,
            req.params.movieId
        );
        return res.status(200).json(
            new ApiResponse(
                200,
                "Movie removed from watchlist",
                null
            )
        );
    })
}

export default new WatchlistController()