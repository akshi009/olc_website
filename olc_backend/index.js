import express from "express";
import authRouter from "./router/authRouter.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import "./model/database.js";


const PORT = process.env.PORT || 8080;
const app = express();
app.use(cors());


app.get("/test", (req, res) => {
    res.send("Hello World!");
});

app.use("/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});