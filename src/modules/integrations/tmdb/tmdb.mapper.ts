import { CreateMovieDto } from "@/modules/movie/movie.types";
import { TmdbMovie } from "./tmdb.types";

export const mapTmdbMovieToMovie = (movie: TmdbMovie): CreateMovieDto => {
    return {
        tmdbId: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.poster_path,
        releaseDate: new Date(),
        genres: [],
        originalLanguage: movie.original_language,
        runtime: 1,
        slug: movie.title
            .toLowerCase()
            .replace(/\s+/g, "-")
    }
}