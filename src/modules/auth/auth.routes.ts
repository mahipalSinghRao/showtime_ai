import { Router } from "express";
import authController from "./auth.controller";
import { validate } from "@/shared/middlewares/validate.middleware";
import { loginSchema, registerSchema } from "./auth.validator";
import { protect } from "@/shared/middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Create a new account.
 *     requestBody:
 *       $ref: '#/components/requestBodies/RegisterRequest'
 *     responses:
 *       "201":
 *         $ref: '#/components/responses/Created'
 *       "409":
 *         $ref: '#/components/responses/Conflict'
 */

router.post("/register", validate(registerSchema), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     requestBody:
 *       $ref: '#/components/requestBodies/LoginRequest'
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/login", validate(loginSchema), authController.login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh access token
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/refresh-token", authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/logout", protect, authController.logout);

/**
 * @swagger
 * /auth/logout-all:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout from all devices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         $ref: '#/components/responses/Success'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post("/logout-all", protect, authController.logoutAll);

export default router;