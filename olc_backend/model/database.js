import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const DB_URI = process.env.MONGO_DB;

mongoose.connect(DB_URI).then(() => {
    console.log("✅ MongoDB Connected Successfully");
}).catch((error) => {
    console.log("❌ Error in MongoDB Connection", error);
});
