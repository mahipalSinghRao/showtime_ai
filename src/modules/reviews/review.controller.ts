import asyncHandler from "@/shared/utils/asyncHandler";
import reviewService from "./review.service";
import ApiResponse from "@/shared/utils/ApiResponse";

class ReviewController {
    createReview = asyncHandler(async (req, res) => {
        const result = await reviewService.createReview({
            ...req.body,
            user: req.user.userId
        });
        return res.status(201).json(
            new ApiResponse(
                201,
                "Review created successfully",
                result
            )
        );
    })

    getMovieReviews = asyncHandler(async (req, res) => {
        const movieId = req.params.id as string
        const result = await reviewService.getMovieReviews(movieId);
        return res.status(200).json(
            new ApiResponse(
                200,
                "Reviews fetched successfully",
                result
            )

        );
    })

    updateReview = asyncHandler(async (req, res) => {
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