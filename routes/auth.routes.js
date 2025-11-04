import express from 'express'
import {forgot, login, signup} from '../controllers/auth.controllers.js'
import upload from '../middleware/multer.js'

const router = express.Router()

router.post("/signup",upload.single('profile'),signup)
router.post("/login",login)
router.post("/forgot",forgot)
// router.post("/login")
export default router 