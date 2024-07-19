import { Router } from "express";
const router = Router();

import { getAttractions,getAttraction,createAttraction,updateAttraction,deleteAttraction } from "../controllers/attraction.controller.js";

router.route("/").get(getAttractions).post(createAttraction);

router.route("/:id").get(getAttraction).put(updateAttraction).delete(deleteAttraction);

export default router;