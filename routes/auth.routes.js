import express from 'express'
import {login, signup} from '../controllers/auth.controllers.js'
import upload from '../middleware/multer.js'

const router = express.Router()

router.post("/signup",upload.single('image'),signup)
router.post("/login",login)
// router.post("/login")
export default router 