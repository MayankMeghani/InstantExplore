import { Router} from "express";
const router = Router();
import { getReviews,getReview,createReview,updateReview,removeReview,addLike } from "../controllers/review.controller.js";
import authMiddleware from "./authMiddleware.js";

router.get('/',getReviews).get('/:id',getReview);
router.post('/',authMiddleware,createReview);
router.put('/:id',authMiddleware,updateReview).delete("/:id",authMiddleware,removeReview);
router.post('/:id/like',authMiddleware,addLike);

export default router;