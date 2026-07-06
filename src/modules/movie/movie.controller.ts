import asyncHandler from "@/shared/utils/asyncHandler";
import ApiResponse from "@/shared/utils/ApiResponse";
import movieService from "./movie.service";

class MovieController {
    syncMovies = asyncHandler(async (req, res) => {
        const result = await movieService.syncMovies()
        return res.status(200).json(
            new ApiResponse(
                200,
                "Movie data fetched successfully",
                result
            )
        );
    })

    getMovies = asyncHandler(async (req, res) => {

        const result = await movieService.getMovie({
            page: Number(req.query.page),
            limit: Number(req.query.limit),

        });
        return res.status(200).json(
            new ApiResponse(
                200,
                "Movies fetched successfully",
                result
            )
        )
    })

    getMovieById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await movieService.getMovieById(id)
        return res.status(200).json(
            new ApiResponse(
                200,
                "Movie fetched successfully",
                result
            )
        );
    })

    getStats = asyncHandler(async (req, res) => {
        const result = await movieService.getStats();
        return res.status(200).json(
            new ApiResponse(
                200,
                "Movie statistics fetched successfully",
                result
            )
        );
    })

    getFeaturedMovies = asyncHandler(async (req, res) => {
        const result = await movieService.getFeaturedMovies()
        return res.status(200).json(
            new ApiResponse(
                200,
                "Featured movies fetched successfully",
                result
            )
        );
    })

    getTrendingMovies = asyncHandler(async (req, res) => {

        const result =
            await movieService.getTrendingMovies();

        return res.status(200).json(
            new ApiResponse(
                200,
                "Trending movies fetched successfully",
                result
            )
        );
    });

    getSimilarMovies = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const result = await movieService.getSimilarMovies(id)
        // console.log(result.length);
        return res.status(200).json(
            new ApiResponse(
                200,
                "Similar movies fetched successfully",
                result
            )
        );
    })
}

export default new MovieController()