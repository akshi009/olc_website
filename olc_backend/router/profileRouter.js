import express from "express";
import { createProfile, deleteProfile, getProfile, updateProfile } from "../controllers/profileController.js";
const router = express.Router()

router.get('/:userId', getProfile)
router.post('/add', createProfile)
router.put('/update/:userId', updateProfile)
router.delete('/delete/:userId', deleteProfile)



export default router