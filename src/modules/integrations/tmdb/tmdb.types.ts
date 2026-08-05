export interface TmdbMovie {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    genre_ids: number[];
    original_language: string;
    voteAverage: number;
    voteCount: number;
    popularity: number;
    adult: boolean;
    video: boolean;
}

export interface TmdbMovieResponse {
    page: number;
    results: TmdbMovie[];
}