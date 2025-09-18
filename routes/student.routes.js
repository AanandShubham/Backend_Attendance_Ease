import express  from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { addStudent, deleteStudent, editStudent } from '../controllers/student.controllers.js'


const router = express.Router()

router.post("/add",protectRoute,addStudent)
router.post("/edit",protectRoute,editStudent)
router.post("/delete",protectRoute,deleteStudent)

export default router