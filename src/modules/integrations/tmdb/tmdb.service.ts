import { BASE_URL, TmdbMovieCategory } from "@/shared/constants/tmdb.constants";
import { TmdbMovieResponse } from "./tmdb.types";
import axios from "axios";
import { env } from "@/config/env";
// import tmdbClient from "./tmdb.client";
// import { TmdbEndpoints } from "./tmdb.constants";

console.log("🔥 TMDB Service Loaded");
class TmdbService {
    private async fetch<T>(

        endpoint: string,
        params: Record<string, any> = {}

    ): Promise<T> {
        try {
            const cleanEndpoint = endpoint.replace(/^\/+/, "");

            const url = new URL(
                cleanEndpoint,
                BASE_URL.endsWith("/") ? BASE_URL : `${BASE_URL}/`
            );

            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.set(key, String(value))
            })

            // const response = await tmdbClient.get<T>(endpoint, { params })
            // console.log("Status:", response.status);
            // console.log("Results:", (response.data as any).results?.length);
            // return response.data;

            const response = await fetch(url.toString(), {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${env.TMDB_API_KEY}`,
                },
            })

            if (!response.ok) {
                throw new Error(
                    `TMDB Error ${response.status}`
                )
            }
           
            return await response.json() as T;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Status:", error.response?.status);
                console.error("Data:", error.response?.data);
                console.error("Message:", error.message);
            } else {
                console.error(error);
            }

            throw error;
        }
    }

    async getMovies(category: TmdbMovieCategory, page = 1) {
        return this.fetch<TmdbMovieResponse>(
            `/movie/${category}`,
            { page }
        )
    }

    async discoverMovies(page = 1) {
        console.log("🔥 fetch() entered");
        return this.fetch<TmdbMovieResponse>(
            "/discover/movie",
            {
                page,
                sort_by: "popularity.desc"
            }
        );
    }

    async getTrending(page = 1) {
        return this.fetch<TmdbMovieResponse>(
            "/trending/movie/day",
            { page }
        );
    }

    async getMovieDetails(id: number) {
        return this.fetch(
            `/movie/${id}`,
            {
                append_to_response:
                    "videos,credits"
            }
        );
    }


}

export default new TmdbService()