import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    color: {
        type: [String],
        required: true
    },
    weight: {
        type: String,
    },
    burnTime: {
        type: String,
    },
    event: {
        ref: "Event",
        type: [String],
    }
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema, "product_collections");

export default Product;