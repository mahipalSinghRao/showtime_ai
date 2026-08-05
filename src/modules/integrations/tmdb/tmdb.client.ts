import { env } from "@/config/env";
import { BASE_URL } from "@/shared/constants/tmdb.constants";
import axios from "axios"

const tmdbClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: "application/json",
        Authorization: `Bearer ${env.TMDB_API_KEY}`,
    },

    timeout: 10000,
})

// const tmdbClient = {
//     async get<T>(endpoint: string, options?: { params?: Record<string, any> }) {
//         const url = new URL(endpoint, BASE_URL);

//         if (options?.params) {
//             Object.entries(options.params).forEach(([k, v]) =>
//                 url.searchParams.set(k, String(v))
//             );
//         }

//         const res = await fetch(url.toString(), {
//             headers: {
//                 Authorization: `Bearer ${env.TMDB_API_KEY}`,
//                 Accept: "application/json",
//             },
//         });

//         const data = await res.json();

//         return {
//             status: res.status,
//             data: data as T,
//         };
//     },
// };

export default tmdbClient;