import Review from "../model/review.js";
import User from "../model/user.js";
import Order from "../model/orders.js";

export const createReview = async (req, res) => {
    const { userId, content, rating, hide = false } = req.body;

    try {
        if (!userId || !content || rating === undefined) {
            return res.status(400).json({ message: "userId, content and rating are required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // const deliveredOrder = await Order.findOne({
        //     userId,
        //     status: "delivered",
        // });

        // if (!deliveredOrder) {
        //     return res.status(403).json({
        //         message: "Only users with a delivered order can create a review",
        //     });
        // }

        const existingReview = await Review.findOne({ user: userId });
        if (existingReview) {
            return res.status(409).json({
                message: "User has already submitted a review",
            });
        }

        const review = new Review({
            user: userId,
            content: content.trim(),
            rating,
            hide,
        });

        await review.save();
        await review.populate("user", "name email");

        return res.status(201).json({
            message: "Review created successfully",
            review,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllReview = async (req, res) => {
    try {
        const includeHidden = req.query.includeHidden === "true";
        const filter = includeHidden ? {} : { hide: false };
        const review = await Review.find(filter)
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({ message: "success", review });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { userId, hide } = req.body;

    try {
        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can update reviews" });
        }

        const updatePayload = {};

        if (typeof hide === "boolean") {
            updatePayload.hide = hide;
        }

        const review = await Review.findOneAndUpdate({ _id: reviewId }, updatePayload, {
            new: true,
            runValidators: true,
        }).populate("user", "name email");

        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        return res.status(200).json({ message: "Review updated successfully", review });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
