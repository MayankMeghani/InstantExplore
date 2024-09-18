import { Router } from "express";
const router = Router();
import authMiddleware from "./authMiddleware.js";
import { getStates,getState,createState,updateState,deleteState } from "../controllers/state.controller.js";

router.get("/",getStates).get("/:id",getState);
router.post("/",createState);

router.put("/:id",authMiddleware,updateState).delete("/:id",authMiddleware,deleteState);

export default router;