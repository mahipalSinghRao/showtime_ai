import { Schema, model } from "mongoose";
import { IReview } from "./review.types";

const reviewSchema = new Schema<IReview>(
    {
        movie: {
            type: Schema.Types.ObjectId,
            ref: "Movie",
            required: true
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 10
        },

        comment: {
            type: String,
            trim: true
        }
    },

    {
        timestamps: true
    }

);

reviewSchema.index({
    movie: 1,
    user: 1
},
    {
        unique: true
    });

export const Review =
    model<IReview>(
        "Review",
        reviewSchema
    );