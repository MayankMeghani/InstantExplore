import { Router } from "express";
const router = Router();
import { getCities, getCity, createCity, updateCity, deleteCity,getCityAttractions } from "../controllers/city.controller.js";
import authMiddleware from "./authMiddleware.js"; 
  router.get("/",getCities).get("/:id",getCity);

  router.post("/",authMiddleware,createCity); 

  router.put("/:id",authMiddleware,updateCity).delete("/:id",authMiddleware,deleteCity);

  router.route("/:id/attractions").get(getCityAttractions);
export default router;
