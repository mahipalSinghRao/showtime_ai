import { Schema, model } from "mongoose";
import { IWatchlist } from "./watchlist.types";

const watchlistSchema = new Schema<IWatchlist>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    movie: {
        type: Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    }
}, { timestamps: true })

watchlistSchema.index({
    user: 1,
    movie: 1
}, { unique: true })

export const Watchlist = model<IWatchlist>(
    "Watchlist",
    watchlistSchema
);

