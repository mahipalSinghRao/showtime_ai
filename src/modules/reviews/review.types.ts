import { HydratedDocument, Types } from "mongoose";

export interface IReview {
    movie: Types.ObjectId;
    user: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateReviewDto {
    movie: Types.ObjectId;
    user: Types.ObjectId;
    rating: number;
    comment: string;
}

export interface UpdateReviewDto {
    rating?: number;
    comment?: string;
}

export type ReviewDocument = HydratedDocument<IReview>;