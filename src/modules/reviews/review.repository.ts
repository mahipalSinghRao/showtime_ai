
import { Review } from "./review.model";
import { CreateReviewDto, UpdateReviewDto } from "./review.types";

class ReviewRepository {
    async create(data: CreateReviewDto) {
        return Review.create(data)
    }

    async findByMovie(movieId: string) {
        return Review.find({ movie: movieId })
            .populate("user", "name avatar")
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
}

export default new ReviewRepository()