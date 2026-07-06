import { HydratedDocument } from "mongoose";

export interface IMovie {
    tmdbId: number;
    title: string;
    originalTitle: string;
    overview: string;
    posterPath: string;
    backdropPath: string;
    releaseDate: Date;
    genres: string[];
    runtime: number;
    status: string;
    voteAverage: number;
    voteCount: number;
    popularity: number;
    adult: boolean;
    trailerKey: string;
    cast: CastMember[];
    crew: CrewMember[];
    budget: number;
    revenue: number;
    createdAt: Date;
    updatedAt: Date;
    slug: string
    isFeatured: boolean
    isTrending: boolean
    keywords: string[]
    productionCompanies: string[]
    country: string[]
    originalLanguage: string;
    tagline: string;
    homepage: string;
    imdbId: string;
    video: boolean;
    originCountry: string[];
}

export interface CreateMovieDto {
    tmdbId: number;
    title: string;
    releaseDate: Date;
    genres: string[];
    language: string;
    overview: string;
    poster: string;
    runtime: number;
}

export interface UpdateMovieDto {
    title?: string;
    overview?: string;
    genres?: string[];
    runtime?: number;
    poster?: string;
}

interface CastMember {
    id: number;
    name: string;
    character: string;
    profilePath: string;
}

interface CrewMember {
    id: number;
    name: string;
    job: string;
    department: string;
}

export type MovieDocument = HydratedDocument<IMovie>