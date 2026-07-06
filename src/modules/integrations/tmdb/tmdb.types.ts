

export interface TmdbMovie {

    id: number;

    title: string;

    overview: string;

    poster_path: string;

    backdrop_path: string;

    vote_average: number;

}

export interface TmdbMovieResponse {

    page: number;

    results: TmdbMovie[];

}