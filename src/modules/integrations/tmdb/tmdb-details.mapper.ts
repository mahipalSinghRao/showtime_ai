import { CreateMovieDto } from "@/modules/movie/movie.types";

export const mapTmdbDetailsToMovie = (movie: any): Partial<CreateMovieDto> => {

    return {

        runtime: movie.runtime,

        budget: movie.budget,

        revenue: movie.revenue,

        genres: movie.genres.map((genre: any) => genre.name),

        productionCompanies: movie.production_companies.map(
            (company: any) => company.name
        ),

        tagline: movie.tagline,

        homepage: movie.homepage,

        imdbId: movie.imdb_id,

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
                profilePath: actor.profile_path
            })),

        crew: movie.credits.crew
            .filter((person: any) =>
                person.job === "Director"
            )
            .map((director: any) => ({
                id: director.id,
                name: director.name,
                job: director.job,
                department: director.department
            }))
    };

};