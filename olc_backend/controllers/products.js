import Product from "../model/products.js";


export const getProducts = async (req, res) => {
    try {
        const { search } = req.query;
        const query = {}
        if (search) {
            query.name = { $regex: search, $options: "i" }
        }
        const products = await Product.find(query);
        res.set("Cache-Control", "public, max-age=300");
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" })
    }
}

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, color, weight, burnTime, category } = req.body;
        const image = req.file;

        if (!name || !description || !price || !image) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const imageBase64 = image.buffer.toString("base64");

        const product = await Product.create({
            name,
            description,
            price,
            color,
            weight,
            burnTime,
            category,
            image: imageBase64
        });

        res.status(200).json({
            message: "success",
            product
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
        const { id } = req.params;
        const { name, description, price, color, weight, burnTime, category } = req.body;

        let imageData;
        if (req.file) {
            imageData = req.file.buffer.toString("base64");
        }

        const product = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                color,
                weight,
                burnTime,
                category,
                ...(imageData && { image: imageData })
            },
        );

        if (!product) return res.status(404).json({ message: "Product not found" });

        res.status(200).json({ message: "success", product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};