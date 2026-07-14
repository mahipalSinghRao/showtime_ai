import { Schema, model } from "mongoose";
import { IMovie } from "./movie.types";

enum MovieStatus {
    RELEASED = "Released",
    PLANNED = "Planned",
    CANCELLED = "Cancelled",
    POST_PRODUCTION = "Post Production"
}

const movieSchema = new Schema<IMovie>({
    tmdbId: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    originalTitle: { type: String, trim: true },
    overview: { type: String, trim: true },
    posterPath: { type: String, required: true },
    backdropPath: String,
    releaseDate: { type: Date, required: true },
    genres: { type: [String], default: [] },
    runtime: {
        type: Number,
        required: true,
        min: 1
    },

    status: {
        type: String,
        enum: Object.values(MovieStatus)
    },
    voteAverage: { type: Number, default: 0 },
    voteCount: Number,
    popularity: Number,
    adult: { type: Boolean, default: false },
    trailerKey: String,
    cast: [{
        id: Number,
        name: String,
        character: String,
        profilePath: String
    }],
    crew: [{
        id: Number,
        name: String,
        job: String,
        department: String
    }],
    budget: {
        type: Number,
        default: 0,
        min: 0
    },
    revenue: {
        type: Number,
        default: 0,
        min: 0
    },
    slug: { type: String, trim: true },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    keywords: { type: [String], default: [] },
    productionCompanies: [{ type: [String], default: [] }],
    country: { type: [String], default: [] },
    originalLanguage: String,
    tagline: { type: String, trim: true },
    homepage: { type: String, trim: true },
    imdbId: String,
    video: { type: Boolean, default: false },
    originCountry: { type: [String], default: [] }
}, { timestamps: true })

movieSchema.index({
    tmdbId: 1,
}, { unique: true });

movieSchema.index({
    slug: 1
});

movieSchema.index({
    releaseDate: -1
});

movieSchema.index({
    voteAverage: -1
});

export const Movie = model<IMovie>("Movie", movieSchema)