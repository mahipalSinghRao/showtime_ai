import { Router } from "express";
import { protect } from "@/shared/middlewares/auth.middleware";
import watchlistController from "./watchlist.controller";
import { validate } from "@/shared/middlewares/validate.middleware";
import { createWatchlistSchema } from "./watchlist.validator";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Watchlist
 *     description: User watchlist management APIs
 */

/**
 * @swagger
 * /watchlist:
 *   post:
 *     tags:
 *       - Watchlist
 *     summary: Add movie to watchlist
 *     description: Add a movie to the authenticated user's watchlist.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: '#/components/requestBodies/AddWatchlistRequest'
 *     responses:
 *       "201":
 *         $ref: '#/components/responses/Created'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "409":
 *         $ref: '#/components/responses/Conflict'
 */
router.post("/", protect, validate(createWatchlistSchema), watchlistController.createWatchlist);

/**
 * @swagger
 * /watchlist:
 *   get:
 *     tags:
 *       - Watchlist
 *     summary: Get user watchlist
 *     description: Fetch the authenticated user's watchlist.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/", protect, watchlistController.getWatchlist);

/**
 * @swagger
 * /watchlist/{movieId}:
 *   delete:
 *     tags:
 *       - Watchlist
 *     summary: Remove movie from watchlist
 *     description: Remove a movie from the authenticated user's watchlist.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
router.delete("/:movieId", protect, watchlistController.removeWatchlist);

export default router;