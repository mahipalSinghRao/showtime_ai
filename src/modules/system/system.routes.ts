import { Router } from "express";
import systemController from "./system.controller";

const router = Router();

router.get("/health", systemController.health);
router.get("/ready", systemController.ready);
router.get("/version", systemController.version);
router.get("/metrics", systemController.metrics);

export default router;