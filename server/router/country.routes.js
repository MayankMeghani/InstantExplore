import { Router } from "express";
const router = Router();

import { getCountries,getCountry,createCountry,updateCountry,deleteCountry } from "../controllers/country.controller.js";

router.route("/").get(getCountries).post(createCountry);

router.route("/:id").get(getCountry).put(updateCountry).delete(deleteCountry);

export default router;