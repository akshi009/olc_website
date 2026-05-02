import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    hide: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Review = mongoose.model('Review', reviewSchema, "review_collections")
export default Review
