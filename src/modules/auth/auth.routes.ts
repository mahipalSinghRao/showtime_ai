import { Router } from "express";
import authController from "./auth.controller";
import { validate } from "@/shared/middlewares/validate.middleware"
import { loginSchema, registerSchema } from "./auth.validator";
import { protect } from "@/shared/middlewares/auth.middleware";

const router = Router()

router.post("/register", validate(registerSchema), authController.register)
router.post("/login", validate(loginSchema), authController.login)
router.post("/refresh-token", authController.refreshToken)
router.post("/logout", protect, authController.logout)
router.post("/logout-all", protect, authController.logoutAll)

export default router;