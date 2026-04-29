import express from "express";
import { getEvents, getEventById, createEvents, updateEvents, deleteEvents } from "../controllers/eventsController.js"
import multer from "multer";
const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', getEvents)
router.get('/:id', getEventById)
router.post('/', upload.single("image"), createEvents)
router.put('/:id', upload.single("image"), updateEvents)
router.delete('/:id', deleteEvents)

export default router
