import { Router } from "express";
import reviewController from "./review.controller";
import { protect } from "@/shared/middlewares/auth.middleware";

const router = Router();

router.post("/", protect, reviewController.createReview);
router.get("/movie/:movieId", reviewController.getMovieReviews);
router.patch("/:id", protect, reviewController.updateReview);

export default router;