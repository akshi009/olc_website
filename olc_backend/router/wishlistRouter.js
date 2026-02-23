import express from "express";
import { addToWishlist, getWishlist } from "../controllers/wishlistController.js";

const router = express.Router();

router.post("/add", addToWishlist);
router.get("/:userId", getWishlist);

export default router;