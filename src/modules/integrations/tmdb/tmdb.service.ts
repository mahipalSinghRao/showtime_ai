import { TmdbMovieCategory } from "@/shared/constants/tmdb.constants";
import tmdbClient from "./tmdb.client";
import { TmdbMovieResponse } from "./tmdb.types";
import axios from "axios";
import { TmdbEndpoints } from "./tmdb.constants";


class TmdbService {
    async getMovies(category: TmdbMovieCategory): Promise<TmdbMovieResponse> {
        try {
            const response = await tmdbClient.get<TmdbMovieResponse>(
                `/movie/${category}`
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log("Axios Code:", error.code);
                console.log("Axios Message:", error.message);
                console.log("Response:", error.response?.data);
            }
            throw error;
        }
    }

    async getMovieDetails(tmdbId: number) {
        const response = await tmdbClient.get(
            `${TmdbEndpoints.DETAILS}/${tmdbId}`,
            {
                params: {
                    append_to_response: "videos,credits"
                }
            }
        );
        return response.data;
    }


}

export default new TmdbService()