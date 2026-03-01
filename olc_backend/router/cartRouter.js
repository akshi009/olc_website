import express from "express"
import { addToCart, getCart, removeCart, updateCart } from "../controllers/cartController"

const router = express.Router()

router.post("/add", addToCart)
router.get("/:userId", getCart)
router.delete("/remove", removeCart)
router.put("/update", updateCart)

export default router
