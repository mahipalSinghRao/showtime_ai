import { TmdbMovieCategory } from "@/shared/constants/tmdb.constants";
import tmdbService from "../integrations/tmdb/tmdb.service";
import { mapTmdbMovieToMovie } from "../integrations/tmdb/tmdb.mapper";
import movieRepository from "./movie.repository";
import ApiError from "@/shared/errors/ApiError";
import { PaginationQuery } from "@/shared/types/pagination.types";
import { mapTmdbDetailsToMovie } from "../integrations/tmdb/tmdb-details.mapper";
import cacheService from "@/shared/cache/cache.service";
import { CreateMovieDto, MovieSyncSource } from "./movie.types";
import auditService from "../audit/audit.service";
import pLimit from "p-limit";

class MovieServices {
    async syncMovies(
        source: MovieSyncSource = "popular",
        pages = 20
    ) {

        let totalMovies = 0;

        for (let currentPage = 1; currentPage <= pages; currentPage++) {

            let movies;

            switch (source) {

                case "popular":

                    movies = await tmdbService.getMovies(
                        TmdbMovieCategory.POPULAR,
                        currentPage
                    );
                    break;

                case "top_rated":

                    movies = await tmdbService.getMovies(
                        TmdbMovieCategory.TOP_RATED,
                        currentPage
                    );
                    break;

                case "upcoming":

                    movies = await tmdbService.getMovies(
                        TmdbMovieCategory.UPCOMING,
                        currentPage
                    );
                    break;

                case "now_playing":

                    movies = await tmdbService.getMovies(
                        TmdbMovieCategory.NOW_PLAYING,
                        currentPage
                    );
                    break;

                case "discover":
                    movies = await tmdbService.discoverMovies(currentPage);

                    console.log("TMDB Response:", movies.results?.length);

                    break;

                case "trending":

                    movies = await tmdbService.getTrending(
                        currentPage
                    );

                    break;

                default:
                    throw new ApiError(
                        400,
                        "Invalid movie source"
                    );
            }

            const limit = pLimit(1);
            const detailedMovies = await Promise.allSettled(
                movies.results.map(movie =>
                    limit(() => tmdbService.getMovieDetails(movie.id))
                )
            );

            const mappedMovies: CreateMovieDto[] =
                movies.results.map((movie, index) => {

                    const detailResult = detailedMovies[index];

                    const details =
                        detailResult.status === "fulfilled"
                            ? detailResult.value
                            : null;

                    if (detailResult.status === "rejected") {
                        console.error(
                            `Movie ${movie.id} failed`,
                            detailResult.reason
                        );
                    }

                    // const mapped = {
                    //     ...mapTmdbMovieToMovie(movie),
                    //     ...(details ? mapTmdbDetailsToMovie(details) : {})
                    // };

                    // console.log("==========");
                    // console.log("TMDB");

                    // console.dir(details, {
                    //     depth: null
                    // });

                    // console.log("Mapped");

                    // console.dir(mapped, {
                    //     depth: null
                    // });

                    return {
                        ...mapTmdbMovieToMovie(movie),

                        ...(details
                            ? mapTmdbDetailsToMovie(details)
                            : {}),

                        isFeatured: currentPage === 1 && index < 5,
                        isTrending: currentPage === 1 && index < 10,
                    };
                });

            await movieRepository.createMany(
                mappedMovies
            );

            totalMovies += mappedMovies.length;
        }

        await Promise.all([

            cacheService.deleteByPattern(
                "movies:*"
            ),

            cacheService.deleteByPattern(
                "movie:*"
            )

        ]);

        await auditService.logMovieSync(true);

        return {
            success: true,
            source,
            pages,
            totalMovies,
            message: `${totalMovies} movies synced successfully.`
        };

    }


    async getMovie(query: PaginationQuery) {

        const cacheKey = `movies:${JSON.stringify(query)}`;
        const cached = await cacheService.get(cacheKey)

        if (cached) {
            return cached;
        }

        const movies = await movieRepository.findAll(query);

        await cacheService.set(
            cacheKey,
            movies,
            300
        );

        return movies;
    }

    async getMovieById(id: string) {
        const cacheKey = `movie:${id}`;
        const cached = await cacheService.get(cacheKey);

        if (cached) {
            return cached;
        }
        const movie = await movieRepository.findById(id)
        if (!movie) {
            throw new ApiError(
                404,
                "Movie not found"
            );
        }
        await cacheService.set(
            cacheKey,
            movie,
            300
        );
        return movie;
    }

    async getStats() {
        const cacheKey = "movies:stats";
        const cached = await cacheService.get(cacheKey)
        if (cached) {
            return cached;
        }
        const stats = await movieRepository.getStats();
        await cacheService.set(
            cacheKey,
            stats,
            600
        );
        return stats;
    }

    async getFeaturedMovies() {
        const cacheKey = "movies:featured";
        const cached = await cacheService.get(cacheKey)
        if (cached) {
            return cached;
        }
        const featured = await movieRepository.findFeatured();
        await cacheService.set(
            cacheKey,
            featured,
            600
        );
        return featured;
    }

    async getTrendingMovies(query: PaginationQuery
    ) {
        const cacheKey = "movies:trending";
        const cached = await cacheService.get(cacheKey)
        if (cached) {
            return cached;
        }
        const trending = await movieRepository.findTrending(query);
        await cacheService.set(
            cacheKey,
            trending,
            600
        );
        return trending;
    }

    async getSimilarMovies(id: string) {
        const cacheKey = `movie:${id}:similar`;
        const cached = await cacheService.get(cacheKey)
        if (cached) {
            return cached;
        }
        const similar = await movieRepository.findSimilar(id);
        await cacheService.set(
            cacheKey,
            similar,
            600
        );
        return similar;
    }
}

export default new MovieServices()