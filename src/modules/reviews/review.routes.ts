import { Router } from "express";
import reviewController from "./review.controller";
import { protect } from "@/shared/middlewares/auth.middleware";
// import { validate } from "@/shared/middlewares/validate.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Movie review management APIs
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     summary: Create a review
 *     description: Create a review for a movie.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *          $ref: '#/components/requestBodies/CreateReviewRequest'
 *     responses:
 *       "201":
 *          $ref: '#/components/responses/Created'
 *       "401":
 *          $ref: '#/components/responses/Unauthorized'
 */
router.post("/", protect, reviewController.createReview);

/**
 * @swagger
 * /reviews/movie/{movieId}:
 *   get:
 *     tags:
 *       - Reviews
 *     summary: Get reviews by movie
 *     description: Fetch all reviews of a movie.
 *     parameters:
 *       - in: path
 *         name: movieId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *          $ref: '#/components/responses/Success'
 *       "404":
 *          $ref: '#/components/responses/NotFound'
 */

router.get("/movie/:movieId", reviewController.getMovieReviews);

/**
 * @swagger
 *   /reviews/{id}:
 *     patch:
 *      tags:
 *        - Reviews
 *      summary: Update review
 *      description: Update an existing review.
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *          $ref: '#/components/requestBodies/UpdateReviewRequest'
 *      responses:
 *          "200":
 *              $ref: '#/components/responses/Success'
 *          "401":
 *              $ref: '#/components/responses/Unauthorized'
 *          "404":
 *              $ref: '#/components/responses/NotFound'
 */
router.patch("/:id", protect, reviewController.updateReview);

export default router;