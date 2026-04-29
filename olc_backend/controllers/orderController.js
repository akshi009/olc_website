import Orders from "../model/orders.js";
import razorpay from "../util/razorpayConfig.js";
import crypto from "crypto";
import Product from "../model/products.js";

export const createOrder = async (req, res) => {
    try {
        const { userId, items, totalAmount } = req.body;

        const orderItem = []
        for (const item of items) {
            const product = await Product.findById(item.productId);
            orderItem.push({
                productId: item.productId,
                name: product.name,
                price: product.price,
                color: item.color,
                quantity: item.quantity
            })
        }

        const order = new Orders({
            userId,
            items: orderItem,
            totalAmount
        })

        await order.save();

        const populatedOrder = await order.populate([
            { path: "userId" },
            { path: "items.productId" }
        ])

        res.status(201).json(populatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        const orders = await Orders.find()
            .populate("userId")
            .populate("items.productId");

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getOrderById = async (req, res) => {
    try {
        const order = await Orders.findById(req.params.id)
            .populate("userId")
            .populate("items.productId");
        if (!order) res.status(404).json({ message: "Order not found" });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getOrdersByUser = async (req, res) => {
    try {
        const orders = await Orders.find({ userId: req.params.userId })
            .sort({ createdAt: -1 })
            .populate("userId")
            .populate("items.productId");

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateOrder = async (req, res) => {
    try {
        const order = await Orders.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const order = await Orders.findByIdAndDelete(req.params.id);
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createPaymentOrder = async (req, res) => {
    try {

        const { totalAmount } = req.body;

        const options = {
            amount: totalAmount * 100,
            currency: "INR",
            receipt: "receipt_" + Date.now(),
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json(order);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const verifyPayment = async (req, res) => {

    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
        .createHmac("sha256", process.env.RAZOR_PAY_TEST_SECRET_KEY)
        .update(sign)
        .digest("hex");

    if (expectedSign === razorpay_signature) {

        // update your order to completed
        res.json({ success: true });

    } else {

        res.status(400).json({ success: false });

    }
};
