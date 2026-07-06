import { env } from "@/config/env";
import { BASE_URL } from "@/shared/constants/tmdb.constants";
import axios from "axios"

const tmdbClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        Authorization: `Bearer ${env.TMDB_API_KEY}`
    },
    timeout: 10000,
})

export default tmdbClient;