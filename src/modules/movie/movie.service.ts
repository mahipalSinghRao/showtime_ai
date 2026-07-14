import { TmdbMovieCategory } from "@/shared/constants/tmdb.constants";
import tmdbService from "../integrations/tmdb/tmdb.service";
import { mapTmdbMovieToMovie } from "../integrations/tmdb/tmdb.mapper";
import movieRepository from "./movie.repository";
import ApiError from "@/shared/errors/ApiError";
import { PaginationQuery } from "@/shared/types/pagination.types";
import { mapTmdbDetailsToMovie } from "../integrations/tmdb/tmdb-details.mapper";
import cacheService from "@/shared/cache/cache.service";
import { CreateMovieDto } from "./movie.types";
import auditService from "../audit/audit.service";

class MovieServices {
    async syncMovies() {
        const movies =
            await tmdbService.getMovies(
                TmdbMovieCategory.POPULAR
            );
        const detailedMovies = await Promise.all(
            movies.results.map((movie) => tmdbService.getMovieDetails(movie.id))
        )

        const mappedMovies: CreateMovieDto[] = movies.results.map((movie, index) => ({
            ...mapTmdbMovieToMovie(movie),
            ...mapTmdbDetailsToMovie(detailedMovies[index]),

            isFeatured: index < 5,
            isTrending: index < 10,
        }));


        await movieRepository.createMany(mappedMovies);

        await Promise.all([
            cacheService.deleteByPattern("movies:*"),
            cacheService.deleteByPattern("movie:*")
        ]);

        await auditService.logMovieSync(true);

        return mappedMovies;
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

    async getTrendingMovies() {
        const cacheKey = "movies:trending";
        const cached = await cacheService.get(cacheKey)
        if (cached) {
            return cached;
        }
        const tranding = await movieRepository.findTrending();
        await cacheService.set(
            cacheKey,
            tranding,
            600
        );
        return tranding;
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