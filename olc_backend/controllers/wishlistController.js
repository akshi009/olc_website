import Wishlist from "../model/wishlist.js";

export const addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const exsist = await Wishlist.findOne({ userId, productId });
        if (exsist) {
            return res.status(400).json({
                message: "Product already in wishlist"
            });
        }
        const wishlist = await Wishlist.create({
            userId,
            // userName,
            productId
        });
        res.status(200).json({
            message: "success",
            wishlist
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body
        const wishlist = await Wishlist.findOneAndDelete({ userId, productId })
        if (!wishlist) {
            return res.status(404).json({
                message: "Product not found in wishlist"
            })
        }
        res.status(200).json({
            message: "success",
            wishlist
        })

    } catch (error) {
        res.status(500).json({
            message: "internal server error"
        })
    }
}

export const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        const wishlist = await Wishlist.find({ userId })
            .populate("userId", "name") // optional
            .populate("productId");     // this is what you need

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