import { Router} from "express";
const router = Router();
import { getReviews,getReview,createReview,updateReview,removeReview } from "../controllers/review.controller.js";
router.route('/').get(getReviews).post(createReview);
router.route('/:id').get(getReview).put(updateReview).delete(removeReview);

export default router;