import express  from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { addStudent, deleteStudent, getStudents, updateStudent } from '../controllers/student.controllers.js'


const router = express.Router()
router.get("/getStudents:id",protectRoute,getStudents)
router.post("/add",protectRoute,addStudent)
router.post("/update",protectRoute,updateStudent)
router.post("/delete",protectRoute,deleteStudent)

export default router