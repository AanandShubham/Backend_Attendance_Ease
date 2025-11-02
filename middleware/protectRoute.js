import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async (req,res,next)=>{
    try {
        // const token = req.authentication 
        // const token = req.cookies.jwt
        let token 

        const authHeader = req.headers.authorization

        if(authHeader && authHeader.startsWith("Token ")){
            token = authHeader.split(" ")[1]
            console.log("-----------------------------------------")
            console.log("Protect Route : Token Got!!!")
            console.log("Token : ",token)
            console.log("-----------------------------------------")
        }

        if(!token){
            return res.status(401).json({error:"Un-authorized user, no token provided"})
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRETE)
        
        if(!decoded){
            return res.status(401).json({error:"Un-authorized , Invalid token"})
        }

        const user = await User.findById(decoded.userId).select("-password")

        if(!user){
            return res.status(401).json({error:"Un-authorized , User not found"})
        }

        req.user = user 

        next()

    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in Class controller AddClass \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
}