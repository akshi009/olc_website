import express from "express";
import { getEvents, getEventById, createEvents, updateEvents, deleteEvents } from "../controllers/eventsController.js"
const router = express.Router()

router.get('/', getEvents)
router.get('/:id', getEventById)
router.post('/', createEvents)
router.put('/:id', updateEvents)
router.delete('/:id', deleteEvents)

export default router