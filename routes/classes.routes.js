import express from 'express'
import { addClass, deleteClass, editClass } from '../controllers/class.controllers.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router()

router.post("/add",protectRoute,addClass)
router.post("/edit",protectRoute,editClass)
router.post("/delete",protectRoute,deleteClass)

export default router 