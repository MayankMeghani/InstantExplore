import { Router } from "express";
const router = Router();
import authMiddleware from "./authMiddleware.js"; 
import {getRequests,updateRequest ,createRequest,deleteRequest } from "../controllers/request.controller.js";

  router.get("/",getRequests);
  // .get("/:id",getCity);

  router.post("/",authMiddleware,createRequest); 

  router.put("/:id",authMiddleware,updateRequest).delete("/:id",authMiddleware,deleteRequest);


export default router;
