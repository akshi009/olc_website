import express from "express";
import { getProducts, addProduct, deleteProduct, updateProduct, getProductById } from "../controllers/products.js";
import multer from "multer"
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/add", upload.single("image"), addProduct)
router.delete("/:id", deleteProduct)
router.put("/:id", upload.single("image"), updateProduct)

export default router;
