import express from "express";
import { createReview, getAllReview, updateReview } from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/create", createReview)
reviewRouter.get("/all", getAllReview)
reviewRouter.put("/:reviewId", updateReview)
export default reviewRouter
