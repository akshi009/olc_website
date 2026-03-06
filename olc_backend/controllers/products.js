import Product from "../model/products.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, image, color, weight, burnTime } = req.body;
        if (!name || !description || !price || !image) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const product = await Product.create({
            name,
            description,
            price,
            color,
            weight,
            burnTime,
            image
        })
        res.status(200).json({
            message: "success",
            product
        })

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndDelete(id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.status(200).json({
            message: 'success',
            product
        })

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findByIdAndUpdate(id,
            req.body,
        )
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        res.status(200).json({
            message: 'success',
        })

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}