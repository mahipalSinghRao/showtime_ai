import { PaginationQuery } from "@/shared/types/pagination.types";
import { Movie } from "./movie.model";
import { CreateMovieDto, IMovie } from "./movie.types";
import { getPagination, getPaginationMeta } from "@/shared/utils/pagination";
import { QueryBuilder } from "@/shared/database/query-builder";
import { Review } from "../reviews/review.model";
import { Types } from "mongoose";
import { ParsedPrompt } from "../ai/ai.types";

class MovieRepository {
    async createMany(data: CreateMovieDto[]) {
        const result = await Movie.bulkWrite(
            data.map((movie) => ({
                updateOne: {
                    filter: {
                        tmdbId: movie.tmdbId
                    },
                    update: {
                        $set: movie
                    },
                    upsert: true
                }
            }))
        );

        console.log(
            "Movie Count:",
            await Movie.countDocuments()
        );

        return result;
    }

    async findAll(query: PaginationQuery) {

        const builder = new QueryBuilder<IMovie>(Movie.find(), query)

        const movies = await builder.search(["title", "overview"]).filter([
            "originalLanguage",
            "genres",
            "isFeatured",
            "isTrending"
        ]).sort([
            "voteAverage",
            "releaseDate",
            "title",
            "popularity"
        ]).paginate().build()
        const total = await Movie.countDocuments(builder.getFilter())
        const { page, limit } = getPagination(query);

        return { movies, pagination: getPaginationMeta(page, limit, total) }
    }

    async findById(id: string) {
        return Movie.findById(id);
    }

    async getStats() {
        const stats = await Movie.aggregate([
            {
                $group: {
                    _id: null,
                    totalMovies: {
                        $sum: 1,
                    },
                    featuredMovies: {
                        $sum: {
                            $cond: ["$isFeatured", 1, 0]
                        }
                    },
                    averageRating: {
                        $avg: "$voteAverage"
                    },
                    trendingMovies: {
                        $sum: {
                            $cond: ["isTrending", 1, 0]
                        },
                    }
                }
            }
        ])
        return stats[0];
    }

    async findFeatured() {
        return Movie.find({ isFeatured: true })
            .sort({ popularity: -1 })
            .limit(10)
    }

    async findTrending(query: PaginationQuery) {
        const builder = new QueryBuilder<IMovie>(
            Movie.find({ isTrending: true }),
            query
        );

        const movies = await builder
            .find()
            .sort({ popularity: -1 })
            .paginate();

        const total = await Movie.countDocuments(builder.getFilter());

        const { page, limit } = getPagination(query);

        return {
            movies,
            pagination: getPaginationMeta(page, limit, total),
        };
    }

    async findSimilar(id: string) {
        const movie = await Movie.findById(id);
        if (!movie) {
            return [];
        }

        return Movie.find({
            _id: { $ne: movie._id },
            genres: { $in: movie.genres }
        }).limit(10);
    }

    async updateRating(movieId: string) {

        const stats = await Review.aggregate([
            {
                $match: {
                    movie: new Types.ObjectId(movieId)
                }
            },

            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "$rating"
                    },
                    totalReviews: {
                        $sum: 1
                    }
                }
            }
        ]);

        if (!stats.length) {
            return;
        }

        await Movie.findByIdAndUpdate(
            movieId,
            {
                vote_average: stats[0].averageRating,
                vote_count: stats[0].totalReviews
            }
        );

    }

    async searchForAI(filters: ParsedPrompt) {

        const conditions: any[] = [];

        if (filters.genres?.length) {
            conditions.push({
                $or: filters.genres.map((genre) => ({
                    genres: {
                        $regex: new RegExp(`^${genre}$`, "i")
                    }
                }))
            });
        }

        if (filters.language) {
            conditions.push({
                originalLanguage: filters.language
            });
        }

        if (filters.year) {
            conditions.push({
                releaseDate: {
                    $gte: new Date(`${filters.year}-01-01`),
                    $lte: new Date(`${filters.year}-12-31`)
                }
            });
        }

        if (filters.keywords?.length) {

            const keywordConditions = [];

            for (const keyword of filters.keywords) {

                keywordConditions.push(

                    {
                        title: {
                            $regex: keyword,
                            $options: "i"
                        }
                    },

                    {
                        overview: {
                            $regex: keyword,
                            $options: "i"
                        }
                    },

                    {
                        genres: {
                            $regex: keyword,
                            $options: "i"
                        }
                    },

                    {
                        productionCompanies: {
                            $elemMatch: {
                                $regex: keyword,
                                $options: "i"
                            }
                        }
                    },

                    {
                        "cast.name": {
                            $regex: keyword,
                            $options: "i"
                        }
                    },

                    {
                        "crew.name": {
                            $regex: keyword,
                            $options: "i"
                        }
                    },

                    {
                        tagline: {
                            $regex: keyword,
                            $options: "i"
                        }
                    }

                );

            }

            conditions.push({
                $or: keywordConditions
            });

        }

        const query =
            conditions.length > 0
                ? { $and: conditions }
                : {};

        return Movie.find(query)
            .select(`
                tmdbId
title
overview
genres
voteAverage
releaseDate
posterPath
runtime
trailerKey
slug
cast
crew
productionCompanies
tagline
`)
            .limit(10);
    }
}

export default new MovieRepository()