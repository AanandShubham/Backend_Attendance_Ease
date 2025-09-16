import jwt from "jsonwebtoken"

export const generateToken = (userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRETE,{
        expiresIn:'15d'
    })

    return token 
}