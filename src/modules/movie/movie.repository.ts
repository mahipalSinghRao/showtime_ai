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
        return Movie.bulkWrite(
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

    async findTrending() {
        return Movie.find({ isTrending: true })
            .sort({ popularity: -1 })
            .limit(10);
    }

    async findSimilar(id: string) {
        const movie = await Movie.findById(id);
        if (!movie) {
            return [];
        }

        console.log(movie.genres);
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
                voteAverage: stats[0].averageRating,
                voteCount: stats[0].totalReviews
            }
        );

    }

    async searchForAI(filters: ParsedPrompt) {
        const query: any = {};
        if (filters.genres?.length) {
            query.genres = {
                $in: filters.genres
            };
        }
        if (filters.language) {
            query.originalLanguage = filters.language;
        }
        if (filters.year) {
            query.releaseDate = {
                $gte: new Date(`${filters.year}-01-01`),
                $lte: new Date(`${filters.year}-12-31`)
            };

        }
        if (filters.keywords?.length) {
            query.$or = filters.keywords.map(keyword => ({
                overview: {
                    $regex: keyword,
                    $options: "i"
                }
            }));
        }

        return Movie.find(query)
            .select("title overview genres voteAverage releaseDate posterPath")
            .limit(10);
    }
}

export default new MovieRepository()