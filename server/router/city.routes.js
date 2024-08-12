import { Router } from "express";
const router = Router();
import { getCities, getCity, createCity, updateCity, deleteCity,getCityAttractions } from "../controllers/city.controller.js";

router.route("/")
  .get(getCities) 
  .post(createCity); 

router.route("/:id")
  .get(getCity) 
  .put(updateCity) 
  .delete(deleteCity); 

  router.route("/:id/attractions")
  .get(getCityAttractions);
export default router;
