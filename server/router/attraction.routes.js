import { Router } from "express";
const router = Router();

import { getAttractions,getAttraction,createAttraction,updateAttraction,deleteAttraction } from "../controllers/attraction.controller.js";
import authMiddleware from "./authMiddleware.js";

router.get("/",getAttractions).get("/:id",getAttraction);

router.post("/", authMiddleware, createAttraction);

router.put("/:id", authMiddleware, updateAttraction).delete("/:id", authMiddleware, deleteAttraction);

export default router;