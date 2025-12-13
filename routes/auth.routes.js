import express from 'express'
import { deleteUser, forgot, getUserData, login, signup } from '../controllers/auth.controllers.js'
import upload from '../middleware/multer.js'
import { protectRoute } from '../middleware/protectRoute.js'

const router = express.Router()
router.get("/getUserData", protectRoute, getUserData)
router.post("/delete-all", protectRoute, deleteUser)
router.post("/signup", upload.single('profile'), signup)
router.post("/login", login)
router.post("/forgot", forgot)
// router.post("/login")
export default router 