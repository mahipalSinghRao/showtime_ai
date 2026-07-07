import { Router } from "express";
import movieController from "./movie.controller";
import { validate } from "@/shared/middlewares/validate.middleware";
import { movieQuerySchema } from "./movie.validator";


const router = Router()

/**
 * @swagger
 *
 * /movies:
 *
 *   get:
 *
 *     summary: Get Movies
 *
 *     tags:
 *
 *       - Movies
 *
 *     responses:
 *
 *       200:
 *
 *         description: Movies fetched successfully
 */

router.get("/get", movieController.syncMovies)
router.get("/", validate(movieQuerySchema), movieController.getMovies);
router.get("/stats", movieController.getStats);
router.get("/featured", movieController.getFeaturedMovies);
router.get("/trending", movieController.getTrendingMovies);
router.get("/:id/similar", movieController.getSimilarMovies);
router.get("/:id", movieController.getMovieById);

export default router;

