import { Router } from "express";
import { protect } from "@/shared/middlewares/auth.middleware";
import watchlistController from "./watchlist.controller";

const router = Router()

router.post("/", protect, watchlistController.createWatchlist);
router.get("/", protect, watchlistController.getWatchlist);
router.delete("/:movieId", protect, watchlistController.removeWatchlist);

export default router;
