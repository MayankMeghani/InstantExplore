import { Router} from "express";
const router = Router();
import { getReviews,getReview,createReview,updateReview,removeReview } from "../controllers/review.controller.js";
import authMiddleware from "./authMiddleware.js";

router.get('/',getReviews).get('/:id',getReview);
router.post('/',authMiddleware,createReview);
router.put('/:id',authMiddleware,updateReview).delete("/:id",authMiddleware,removeReview);

export default router;