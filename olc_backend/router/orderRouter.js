import express from "express";
import { createOrder, getOrders, getOrderById, updateOrder, deleteOrder, createPaymentOrder, verifyPayment, getOrdersByUser } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/user/:userId", getOrdersByUser);
router.get("/:id", getOrderById);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);
router.post("/create-payment", createPaymentOrder);
router.post("/verify-payment", verifyPayment);

export default router;
