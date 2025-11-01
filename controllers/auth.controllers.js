import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { generateToken } from "../utils/generateToken.js"
import uploadToCloudinary from "../utils/uploadToCloudinary.js"

export const signup = async (req, res) => {
    try {
        const { username, fullname, password, confirmPassword, securityKey } = req.body


        console.log("signup request Got : details : ", req.body)
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "password and confirm password doesnot match" })
        }

        const user = await User.findOne({ username })

        if (user) {
            return res.status(409).json({ message: "User Already Available" })
        }

        // uploading file to cloudinary 
        const profile = await uploadToCloudinary(req.file.path)  

        // generating hashed password 
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        const newUser = await User.create({
            username,
            fullname,
            password: hashedPassword,
            securityKey,
            profile
        })

        if (newUser) {
            // generate token
            const token = generateToken(newUser._id)
            await newUser.save()
            // setting cookies for api testing 
            res.cookie('jwt', token, {
                maxAge: 5 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: "strict",
            })
            return res.status(201).json({ user: newUser, token })
        }
        else {
            return res.status(400).json({ error: "Invalid User Data" })
        }

    } catch (error) {

        console.log("--------------------------------------------------")
        console.log("Error in auth controller Signup \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })

    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        console.log("Username : ",username)
        console.log("Passoword : ",password)

        const user = await User.findOne({ username })?.populate("classes")
        // console.log("Classes : ",user["classes"])
        const isPasswordTrue = await bcrypt.compare(password, user?.password || "")

        if (!user && !isPasswordTrue) {
            return res.status(500).json({ error: "User details are invalid !!" })
        }

        const token = generateToken(user._id)
        // setting cookies for api testing 
        res.cookie('jwt', token, {
            maxAge: 5 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
        })

        return res.status(200).json({ user, token })

    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in auth controller Login \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
}

export const logout = async (req,res)=>{
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        })

        res.status(200).json({message:"Logout Successfully !!"})
        
    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in auth controller Logout \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" }) 
    }
}

