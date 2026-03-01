import Cart from "../model/cart";

export const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        const cart = await Cart.findOne({ user: userId });
        if (cart) {
            cart.items.push({ product: productId, quantity });
            await cart.save();
            res.status(200).json({ message: "Item added to cart successfully" });
        } else {
            const newCart = new Cart({ user: userId, items: [{ product: productId, quantity }] });
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
            const item = await Cart.findOne({ user: userId })
            if (item) {
                cart.items = cart.items.filter((item) => item.productId != productId)
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
        const { userId, productId, quantity } = req.body
        const cart = await Cart.findOne({ user: userId })
        if (cart) {
            const existnigProduct = cart.items.find((item) => item.productId == productId)
            if (existnigProduct) {
                existnigProduct.quantity = quantity
                await cart.save()
                res.status(200).json({ message: "Cart updated successfully" })
            }
            else {
                res.status(404).json({ message: "Product not found in cart" })
            }
        }
        else {
            res.status(404).json({ message: "Cart not found" })
        }

    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}
