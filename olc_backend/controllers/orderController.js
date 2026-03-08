import orders from "../model/orders.js";

export const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;
        const order = new orders({ userId, items, totalAmount });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getOrders = async (req, res) => {
    try {
        const orders = await orders.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getOrderById = async (req, res) => {
    try {
        const order = await orders.findById(req.params.id);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateOrder = async (req, res) => {
    try {
        const order = await orders.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const order = await orders.findByIdAndDelete(req.params.id);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}