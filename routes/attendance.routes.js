import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { addAttendance, deleteAttendance } from '../controllers/attendance.controllers.js'

const router = express.Router()

router.post("/add",protectRoute,addAttendance)
router.post("/delete",protectRoute,deleteAttendance)

export default router