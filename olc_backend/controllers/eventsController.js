import Event from "../model/events.js";
import Product from "../model/products.js";

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getEventById = async (req, res) => {
    try {
        const product = await Product.find({ event: req.params.id });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createEvents = async (req, res) => {
    try {
        const { name, description, image } = req.body
        const event = new Event({
            name, description, image
        })
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateEvents = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteEvents = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}