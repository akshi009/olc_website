import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    // userName: {
    //     type: String,
    //     required: true
    // },
    productId: {
        type: Number,
        ref: "Product",
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Wishlist", WishlistSchema);