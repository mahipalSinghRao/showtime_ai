import asyncHandler from "@/shared/utils/asyncHandler";
import ApiResponse from "@/shared/utils/ApiResponse";
import movieService from "./movie.service";
import { getMovieQueue } from "@/jobs/queues/movie.queue";
import { PaginationQuery } from "@/shared/types/pagination.types";
import { Request, Response } from "express";
import { MovieSyncSource } from "./movie.types";

class MovieController {

    syncMovies = asyncHandler(async (req, res: Response) => {
        const source = (req.query.source as MovieSyncSource);
        const page = Number(req.query.page) || 20;
        await getMovieQueue().add("sync", { source, page }, {
            jobId: `movie-sync-${source}-${page}-${Date.now()}`, attempts: 1,
            backoff: {
                type: "exponential",
                delay: 3000
            },
            removeOnComplete: true,
            removeOnFail: 100,
        })

        return res.status(202).json(
            new ApiResponse(
                202,
                `${source} movie sync started`,
                { source, page }
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