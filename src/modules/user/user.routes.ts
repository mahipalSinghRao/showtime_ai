import { Router } from "express";
import authController from "../auth/auth.controller";
import { protect } from "@/shared/middlewares/auth.middleware";
import userController from "./user.controller";
import { validate } from "@/shared/middlewares/validate.middleware";
import { userUpdateSchema } from "./user.validator";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User profile management APIs
 */

/**
 * @swagger
 * /user/me:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user profile
 *     description: Returns the profile of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.get("/me", protect, authController.getMe);

/**
 * @swagger
 * /user/update:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update user profile
 *     description: Update the authenticated user's profile.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Mahipal Singh
 *               avatar:
 *                 type: string
 *                 example: https://example.com/avatar.jpg
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.patch(
    "/update",
    protect,
    validate(userUpdateSchema),
    userController.updateProfile
);

export default router;