import { Router } from "express";
const router = Router();

import { getUsers,getUser,createUser,updateUser,deleteUser,validateUser,getReviews } from "../controllers/user.controller.js";

router.route("/").get(getUsers).post(createUser);

router.route("/validate").post(validateUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

router.route("/reviews/:userId").get(getReviews);

export default router;