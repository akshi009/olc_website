import express from "express";
import authRouter from "./router/authRouter.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import "./model/database.js";
import wishlistRouter from "./router/wishlistRouter.js";
import productRouter from "./router/productRouter.js";
import cartRouter from "./router/cartRouter.js";
import profileRouter from "./router/profileRouter.js";
import orderRouter from "./router/orderRouter.js";

const PORT = process.env.PORT || 8080;
const app = express();
app.use(cors());
app.use(express.json());


app.get("/test", (req, res) => {
    res.send("Hello World!");
});

app.use('/api/wishlist', wishlistRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/profile', profileRouter);
app.use('/api/orders', orderRouter);

app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});