import { Router } from "express";
const router = Router();
import authMiddleware from "./authMiddleware.js";
import { getCountries,getCountry,createCountry,updateCountry,deleteCountry,getCountryStates } from "../controllers/country.controller.js";

router.get("/",getCountries).get("/:id",getCountry);
router.post("/",authMiddleware,createCountry);
router.put("/:id",authMiddleware,updateCountry).delete("/:id",authMiddleware,deleteCountry);
router.get("/:id/states",getCountryStates);

export default router;