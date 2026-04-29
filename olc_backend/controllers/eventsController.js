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
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const products = await Product.find({ event: req.params.id });
        res.status(200).json({ event, products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createEvents = async (req, res) => {
    try {
        const { eventname } = req.body;
        const imageFile = req.file;

        if (!eventname || !imageFile) {
            return res.status(400).json({ message: "Event name and image are required" });
        }

        const event = new Event({
            eventname,
            image: imageFile.buffer.toString("base64")
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateEvents = async (req, res) => {
    try {
        const updates = {};

        if (req.body.eventname) {
            updates.eventname = req.body.eventname;
        }

        if (req.file) {
            updates.image = req.file.buffer.toString("base64");
        }

        const event = await Event.findByIdAndUpdate(req.params.id, updates, { new: true });
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
