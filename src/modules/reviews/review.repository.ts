
import { Types } from "mongoose";
import { Review } from "./review.model";
import { CreateReviewDto, UpdateReviewDto } from "./review.types";

class ReviewRepository {
    async create(data: CreateReviewDto) {
        return Review.create(data)
    }

    async findByMovie(movieId: string) {
        return Review.find({ movie: movieId })
            .populate("user", "fullName  avatar")
            .sort({ createdAt: -1 })
    }
    async findById(id: string) {
        return Review.findById(id);
    }

    async update(id: string, data: UpdateReviewDto) {
        return Review.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true
            }
        );
    }

    async findByMovieAndUser(
        movieId: Types.ObjectId,
        userId: Types.ObjectId
    ) {
        return Review.findOne({
            movie: movieId,
            user: userId,
        });
    }
}

export default new ReviewRepository()