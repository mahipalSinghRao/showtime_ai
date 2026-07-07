import { Router } from "express";
import aiController from "./ai.controller";


const router = Router();

router.post("/", aiController.recommend);

export default router;