import express from "express";
import { getProducts, addProduct, deleteProduct, updateProduct } from "../controllers/products.js";
const router = express.Router();

router.get("/", getProducts)
router.post("/add", addProduct)
router.delete("/:id", deleteProduct)
router.put("/:id", updateProduct)

export default router;