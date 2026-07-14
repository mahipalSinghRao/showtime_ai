import ApiError from "@/shared/errors/ApiError";
import movieRepository from "../movie/movie.repository";
import reviewRepository from "./review.repository";
import { CreateReviewDto, UpdateReviewDto } from "./review.types";
import auditService from "../audit/audit.service";
import { RequestContext } from "@/shared/context/request-context";

class ReviewService {
    async createReview(data: CreateReviewDto, context?: RequestContext) {
        const existingReview =
            await reviewRepository.findByMovieAndUser(
                data.movie,
                data.user
            );

        if (existingReview) {
            throw new ApiError(
                409,
                "You have already reviewed this movie."
            );
        }
        const review = await reviewRepository.create(data);

        await movieRepository.updateRating(data.movie.toString());

        await auditService.logReviewCreate(
            true,
            context
        );
        return review
    }

    async getMovieReviews(movieId: string) {
        return reviewRepository.findByMovie(movieId)
    }

    async updateReview(
        id: string,
        userId: string,
        data: UpdateReviewDto,
        context?: RequestContext
    ) {

        const review = await reviewRepository.findById(id);

        if (!review) {
            throw new ApiError(
                404,
                "Review not found"
            );
        }

        if (review.user.toString() !== userId) {
            throw new ApiError(
                403,
                "You are not allowed to update this review"
            );
        }

        const updatedReview =
            await reviewRepository.update(id, data);

        await movieRepository.updateRating(
            review.movie.toString()
        );

        await auditService.logReviewCreate(
            true,
            context
        );

        return updatedReview;
    }

}

export default new ReviewService()