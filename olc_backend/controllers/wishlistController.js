import Wishlist from "../model/wishlist.js";

export const addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                userId,
                items: [{ productId }]
            });
        } else {
            const exist = wishlist.items.find(
                item => item.productId.toString() === productId
            );

            if (exist) {
                return res.status(400).json({
                    message: "Product already in wishlist"
                });
            }

            wishlist.items.push({ productId });
            await wishlist.save();
        }

        res.status(200).json({
            message: "success",
            wishlist
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;

        const wishlist = await Wishlist.findOneAndUpdate(
            { userId },
            { $pull: { items: { productId } } },
            { new: true }
        );

        res.status(200).json({
            message: "success",
            wishlist
        });

    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        });
    }
};

export const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        const wishlist = await Wishlist.find({ userId })
            .populate("userId", "name")
            .populate("items.productId");

        res.status(200).json({
            message: "success",
            wishlist
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }

}