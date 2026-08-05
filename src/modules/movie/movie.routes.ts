import { Router } from "express";
import movieController from "./movie.controller";
import { validate } from "@/shared/middlewares/validate.middleware";
import { movieQuerySchema } from "./movie.validator";
// import tmdbService from "../integrations/tmdb/tmdb.service";
// import axios from "axios";
import { env } from "@/config/env";
// import { authorize } from "@/shared/middlewares/role.middleware";


const router = Router()

/**
 * @swagger
 * tags:
 *   - name: Movies
 *     description: Movie management APIs
 */



/**
 * @swagger
 * /movies/get:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Synchronize movies
 *     description: Import latest movies from TMDB into the local database.
 *     responses:
 *       200:
 *         description: Movies synchronized successfully
 */

router.get("/get", validate(movieQuerySchema), movieController.getMovies);

/**
 * @swagger
 * /movies:
 *   post:
 *     tags:
 *       - Movies
 *     summary: Get movies
 *     description: Fetch movies with pagination, search and filters.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 20
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: avengers
 *     responses:
 *       200:
 *         description: Movies fetched successfully
 */

router.post("/sync", movieController.syncMovies)

/**
 * @swagger
 * /movies/stats:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get movie statistics
 *     responses:
 *       200:
 *         description: Statistics fetched successfully
 */

router.get("/stats", movieController.getStats);

/**
 * @swagger
 * /movies/featured:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get featured movies
 *     responses:
 *       200:
 *         description: Featured movies fetched successfully
 */


router.get("/featured", movieController.getFeaturedMovies);

/**
 * @swagger
 * /movies/trending:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get trending movies
 *     responses:
 *       200:
 *         description: Trending movies fetched successfully
 */

router.get("/trending", movieController.getTrendingMovies);

// router.get("/testTMDB", async (req, res) => {
//     try {
//         const response = await axios.get(
//             "https://api.themoviedb.org/3/discover/movie",
//             {
//                 headers: {
//                     Authorization: `Bearer ${env.TMDB_API_KEY}`,
//                     Accept: "application/json",
//                 },
//                 params: {
//                     page: 1,
//                     sort_by: "popularity.desc",
//                 },
//             }
//         );

//         res.json({
//             success: true,
//             status: response.status,
//             totalResults: response.data.total_results,
//             firstMovie: response.data.results[0],
//         });
//     } catch (error: any) {
//         res.status(500).json({
//             success: false,
//             message: error.message,
//             code: error.code,
//             status: error.response?.status,
//             data: error.response?.data,
//         });
//     }
// });

router.get("/test-fetch", async (_req, res) => {
    try {
        for (let i = 0; i < 20; i++) {
            const r = await fetch(
                "https://api.themoviedb.org/3/discover/movie?page=1",
                {
                    headers: {
                        Authorization: `Bearer ${env.TMDB_API_KEY}`,
                        Accept: "application/json",
                    },
                }
            );

            console.log(i, r.status);
        }

        res.send("done");
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});


/**
 * @swagger
 * /movies/{id}/similar:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get similar movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Similar movies fetched successfully
 */

router.get("/:id/similar", movieController.getSimilarMovies);

/**
 * @swagger
 * /movies/{id}:
 *   get:
 *     tags:
 *       - Movies
 *     summary: Get movie by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *           $ref: '#/components/responses/Success'
 *
 *       "404":
 *           $ref: '#/components/responses/NotFound'
 */

router.get("/:id", movieController.getMovieById);


export default router;