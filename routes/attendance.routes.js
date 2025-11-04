import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { addAttendance, deleteAttendance, getAllAttendance } from '../controllers/attendance.controllers.js'

const router = express.Router()
router.get("/getAll:id",protectRoute,getAllAttendance)
router.post("/add",protectRoute,addAttendance)
router.post("/delete",protectRoute,deleteAttendance)

export default router