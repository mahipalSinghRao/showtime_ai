import { TmdbMovieCategory } from "@/shared/constants/tmdb.constants";
import tmdbService from "../integrations/tmdb/tmdb.service";
import { mapTmdbMovieToMovie } from "../integrations/tmdb/tmdb.mapper";
import movieRepository from "./movie.repository";
import ApiError from "@/shared/errors/ApiError";
import { PaginationQuery } from "@/shared/types/pagination.types";
import { TmdbEndpoints } from "../integrations/tmdb/tmdb.constants";
import { mapTmdbDetailsToMovie } from "../integrations/tmdb/tmdb-details.mapper";

class MovieServices {
    async syncMovies() {
        const movies =
            await tmdbService.getMovies(
                TmdbMovieCategory.POPULAR
            );
        const detailedMovies = await Promise.all(
            movies.results.map((movie) => tmdbService.getMovieDetails(movie.id))
        )

        const mappedMovies = movies.results.map((movie, index) => ({
            ...mapTmdbMovieToMovie(movie),
            ...mapTmdbDetailsToMovie(detailedMovies[index])
        }));
        mappedMovies.forEach((movie, index) => {

            if (index < 5) {
                movie.isFeatured = true;
            }
            if (index < 10) {
                movie.isTrending = true;
            }
        });

        await movieRepository.createMany(mappedMovies)

        return mappedMovies;
    }

    async getMovie(query: PaginationQuery) {
        return await movieRepository.findAll(query)
    }

    async getMovieById(id: string) {
        const movie = await movieRepository.findById(id)
        if (!movie) {
            throw new ApiError(
                404,
                "Movie not found",
                null
            );
        }
        return movie;
    }

    async getStats() {
        return movieRepository.getStats()
    }

    async getFeaturedMovies() {
        return movieRepository.findFeatured();
    }

    async getTrendingMovies() {
        return movieRepository.findTrending();
    }

    async getSimilarMovies(id: string) {
        return movieRepository.findSimilar(id);
    }
}

export default new MovieServices()