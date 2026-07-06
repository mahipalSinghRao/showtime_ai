import { Router } from "express";
import authController from "../auth/auth.controller";
import { protect } from "@/shared/middlewares/auth.middleware";
import userController from "./user.controller";


const router = Router()

router.get("/me", protect, authController.getMe)
router.patch("/update", protect, userController.updateProfile)


export default router;