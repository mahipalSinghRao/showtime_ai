import { Router } from "express";
import authController from "./auth.controller";
import { validate } from "@/shared/middlewares/validate.middleware"
import { loginSchema, registerSchema } from "./auth.validator";

const router = Router()

router.post("/register", validate(registerSchema), authController.register)
router.post("/login", validate(loginSchema), authController.login)
router.post("/refresh-token", authController.refreshToken)
router.post("/logout", authController.logout)

export default router;