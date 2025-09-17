import express  from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { addStudent, editStudent } from '../controllers/student.controllers.js'


const router = express.Router()

router.post("/add",protectRoute,addStudent)
router.post("/edit",protectRoute,editStudent)

export default router