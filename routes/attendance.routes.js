import express from 'express'
import { protectRoute } from '../middleware/protectRoute'

const router = express.Router()

router.post("/add",protectRoute,(req,res)=>{})

export default router