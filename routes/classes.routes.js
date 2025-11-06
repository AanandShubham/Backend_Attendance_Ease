import express from 'express'
import { addClass, deleteClass, getDetails, updateClass } from '../controllers/class.controllers.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router()
router.get("/getDetails/:id",protectRoute,getDetails)
router.post("/add",protectRoute,addClass)
router.post("/update",protectRoute,updateClass)
router.post("/delete",protectRoute,deleteClass)

export default router 