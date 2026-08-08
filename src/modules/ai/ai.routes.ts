import { Router } from "express";
import aiController from "./ai.controller";
import { protect } from "@/shared/middlewares/auth.middleware";


const router = Router();

/**
 * @swagger
 * tags:
 *   - name: AI
 *     description: AI powered movie recommendation APIs
 */

/**
 * @swagger
 * /recommend:
 *   post:
 *     tags:
 *       - AI
 *     summary: Generate movie recommendations
 *     description: Generate personalized movie recommendations using AI.
 *     requestBody:
 *       $ref: '#/components/requestBodies/AIRecommendationRequest'
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "429":
 *         $ref: '#/components/responses/TooManyRequests'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

router.post("/recommend", protect, aiController.recommend);


export default router;