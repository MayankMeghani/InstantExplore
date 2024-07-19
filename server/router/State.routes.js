import { Router } from "express";
const router = Router();

import { getStates,getState,createState,updateState,deleteState } from "../controllers/state.controller.js";

router.route("/").get(getStates).post(createState);

router.route("/:id").get(getState).put(updateState).delete(deleteState);

export default router;