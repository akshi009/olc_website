import Cart from "../model/cart.js";

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cart = await Cart.findOne({ user: userId });

        if (cart) {
            const existingItem = cart.items.find(
                (item) => item.productId.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({ productId, quantity });
            }

            await cart.save();
            res.status(200).json({ message: "Item added to cart successfully" });
        } else {
            const newCart = new Cart({ user: userId, items: [{ productId, quantity }] });
            await newCart.save();
            res.status(200).json({ message: "Item added to cart successfully" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ user: userId }).populate("items.productId");
        res.status(200).json({ message: "success", cart });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export const removeCart = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await Cart.findOne({ user: userId })
        if (cart) {
            const item = cart.items.find((item) => item.productId.toString() === productId)
            if (item) {
                cart.items = cart.items.filter((item) => item.productId.toString() != productId)
                await cart.save();
                res.status(200).json({ message: "Item removed from cart successfully" });
            }
            else {
                res.status(404).json({ message: "Item not found in cart" });
            }
        }
        else {
            res.status(404).json({ message: "Cart not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const updateCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const existingProduct = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        existingProduct.quantity = quantity;

        await cart.save();

        res.status(200).json({ message: "Cart updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const clearCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items = [];
            await cart.save();
            res.status(200).json({ message: "Cart cleared successfully" });
        }
        else {
            res.status(404).json({ message: "Cart not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

