import { Router } from "express";
const router = Router();

import { getUsers,getUser,createUser,updateUser,deleteUser } from "../controllers/user.controller.js";

router.route("/").get(getUsers).post(createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;