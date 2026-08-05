import { CreateMovieDto } from "@/modules/movie/movie.types";

export const mapTmdbDetailsToMovie = (
    movie: any
): Partial<CreateMovieDto> => {
    return {
        runtime: movie.runtime,

        budget: movie.budget,

        revenue: movie.revenue,

        genres: movie.genres.map((genre: any) => genre.name),

        productionCompanies: movie.production_companies.map(
            (company: any) => company.name
        ),

        country: movie.production_countries.map(
            (country: any) => country.name
        ),

        originCountry: movie.origin_country,

        tagline: movie.tagline,

        homepage: movie.homepage,

        imdbId: movie.imdb_id,

        voteAverage: movie.vote_average,

        voteCount: movie.vote_count,

        popularity: movie.popularity,

        status: movie.status,

        adult: movie.adult,

        video: movie.video,

        backdropPath: movie.backdrop_path,

        originalTitle: movie.original_title,

        trailerKey:
            movie.videos.results.find(
                (video: any) =>
                    video.type === "Trailer" &&
                    video.site === "YouTube"
            )?.key ?? "",

        cast: movie.credits.cast
            .slice(0, 10)
            .map((actor: any) => ({
                id: actor.id,
                name: actor.name,
                character: actor.character,
                profilePath: actor.profile_path,
            })),

        crew: movie.credits.crew
            .filter(
                (person: any) => person.job === "Director"
            )
            .map((director: any) => ({
                id: director.id,
                name: director.name,
                job: director.job,
                department: director.department,
            })),
    };
};