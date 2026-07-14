import asyncHandler from "@/shared/utils/asyncHandler";
import ApiResponse from "@/shared/utils/ApiResponse";
import movieService from "./movie.service";
import { getMovieQueue } from "@/jobs/queues/movie.queue";
import { PaginationQuery } from "@/shared/types/pagination.types";
import { Request, Response } from "express";

class MovieController {
    syncMovies = asyncHandler(async (_req, res: Response) => {
        // console.log("Controller reached");
        await getMovieQueue().add("sync", {
            jobId: "movie-sync", attempts: 3,
            backoff: {
                type: "exponential",
                delay: 3000
            }
        })
        // console.log("Service returned");
        return res.status(202).json(
            new ApiResponse(
                202,
                "Movie sync started",
                null
            )
        );
    })

    getMovies = asyncHandler(async (req: Request, res: Response) => {

        const result = await movieService.getMovie(
            req.query as PaginationQuery
        );
        return res.status(200).json(
            new ApiResponse(
                200,
                "Movies fetched successfully",
                result
            )
        )
    })

    getMovieById = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await movieService.getMovieById(id)
        return res.status(200).json(
            new ApiResponse(
                200,
                "Movie fetched successfully",
                result
            )
        );
    })

    getStats = asyncHandler(async (_req, res: Response) => {
        const result = await movieService.getStats();
        return res.status(200).json(
            new ApiResponse(
                200,
                "Movie statistics fetched successfully",
                result
            )
        );
    })

    getFeaturedMovies = asyncHandler(async (_req, res: Response) => {
        const result = await movieService.getFeaturedMovies()
        return res.status(200).json(
            new ApiResponse(
                200,
                "Featured movies fetched successfully",
                result
            )
        );
    })

    getTrendingMovies = asyncHandler(async (_req, res: Response) => {

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

    getSimilarMovies = asyncHandler(async (req: Request, res: Response) => {
        const id = req.params.id as string;
        const result = await movieService.getSimilarMovies(id)
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