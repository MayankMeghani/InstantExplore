import { Router } from "express";
const router = Router();

import { getUsers,getUser,createUser,updateUser,deleteUser,validateUser,getReviews,login,isValidToken } from "../controllers/user.controller.js";

import authMiddleware from "./authMiddleware.js";

router.route("/").get(getUsers).post(createUser);

router.route("/validate").post(validateUser);

router.route("/valid").post(isValidToken);

router.route("/login").post(login);

router.route("/:id").get(getUser);

router.put("/:id",authMiddleware,updateUser).delete("/:id",authMiddleware,deleteUser);

router.route("/reviews/:userId").get(getReviews);

export default router;