import asyncHandler from "@/shared/utils/asyncHandler";
import reviewService from "./review.service";
import ApiResponse from "@/shared/utils/ApiResponse";
import { getRequestContext } from "@/shared/context/request-context";
import { Request, Response } from "express";

class ReviewController {
    createReview = asyncHandler(async (req: Request, res: Response) => {
        const result =
            await reviewService.createReview(
                {
                    ...req.body,
                    user: req.user.userId,
                },
                getRequestContext(req)
            );
        return res.status(201).json(
            new ApiResponse(
                201,
                "Review created successfully",
                result
            )
        );
    })

    getMovieReviews = asyncHandler(async (req: Request, res: Response) => {
        const movieId = req.params.movieId as string
        const result = await reviewService.getMovieReviews(movieId);
        return res.status(200).json(
            new ApiResponse(
                200,
                "Reviews fetched successfully",
                result
            )

        );
    })

    updateReview = asyncHandler(async (req: Request, res: Response) => {
        const result =
            await reviewService.updateReview(
                req.params.id as string,
                req.user.userId,
                req.body
            );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Review updated successfully",
                result
            )
        );
    });
}

export default new ReviewController();