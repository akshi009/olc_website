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
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const wishlist = await Wishlist.find({ userId }).populate("userId", "name");
        res.status(200).json({
            message: "success",
            wishlist
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
}