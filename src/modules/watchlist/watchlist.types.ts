import { HydratedDocument, Types } from "mongoose";

export interface IWatchlist {
    user: Types.ObjectId;
    movie: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateWatchlistDto {
    user: Types.ObjectId;
    movie: Types.ObjectId;
}

export type WatchlistDocument = HydratedDocument<IWatchlist>;