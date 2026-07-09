import ApiError from "@/shared/errors/ApiError";
import movieRepository from "../movie/movie.repository";
import reviewRepository from "./review.repository";
import { CreateReviewDto, UpdateReviewDto } from "./review.types";
import auditService from "../audit/audit.service";
import { RequestContext } from "@/shared/context/request-context";

class ReviewService {
    async createReview(data: CreateReviewDto, context?: RequestContext) {
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
        data: UpdateReviewDto
    ) {

        const review = await reviewRepository.findById(id);

        if (!review) {
            throw new ApiError(
                404,
                "Review not found"
            );
        }
        // console.log("Review User :", review.user.toString());
        // console.log("Logged User :", userId);
        // console.log("Equal ?", review.user.toString() === userId);
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

        return updatedReview;
    }

}

export default new ReviewService()