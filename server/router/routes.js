import { Router } from "express";
const router = Router();
router.route("/").get((req, res) => {
    res.send("API is running");
});


export default router;