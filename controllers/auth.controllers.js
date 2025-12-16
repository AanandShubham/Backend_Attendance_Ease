import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import { generateToken } from "../utils/generateToken.js"
import uploadToCloudinary from "../utils/uploadToCloudinary.js"
import Class from '../models/class.model.js'
import mongoose from "mongoose"
import Attendance from "../models/attendance.model.js"
import Student from "../models/student.model.js"

export const getUserData = async (req, res) => {

    const user = req.user

    const userData = await User.findById(user._id).select("-password").populate("classes")

    return res.status(200).json({ user: userData })

}

export const signup = async (req, res) => {   // write transactin logic for this ASAP
    try {
        const { username, fullname, password, confirmPassword, securityKey } = req.body

        console.log("---------------------------------------------------")
        console.log("signup request Got : details : ", req.body)
        console.log("Path : ", req.file.path);
        console.log("---------------------------------------------------")

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "password and confirm password doesnot match" })
        }

        const user = await User.findOne({ username })

        if (user) {
            return res.status(409).json({ message: "User Already Available" })
        }

        // uploading file to cloudinary 
        // const profile = await uploadToCloudinary(req.file.path)
        const profile = await uploadToCloudinary(req.file.buffer, "profile_pics");

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
            // res.cookie('jwt', token, {
            //     maxAge: 5 * 24 * 60 * 60 * 1000,
            //     httpOnly: true,
            //     sameSite: "strict",
            // })
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
        // console.log("Username : ", username)
        // console.log("Passoword : ", password)

        const user = await User.findOne({ username })?.populate("classes")
        // console.log("Classes : ",user["classes"])
        const isPasswordTrue = await bcrypt.compare(password, user?.password || "")

        if (!user && !isPasswordTrue) {
            return res.status(500).json({ error: "User details are invalid !!" })
        }

        const token = generateToken(user._id)
        // setting cookies for api testing 
        // res.cookie('jwt', token, {
        //     maxAge: 5 * 24 * 60 * 60 * 1000,
        //     httpOnly: true,
        //     sameSite: "strict",
        // })

        return res.status(200).json({ user, token })

    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in auth controller Login \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
}

export const forgot = async (req, res) => {

    try {
        const { username, securityKey, password, confirmPassword } = req.body

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password and confirmPassword does not match !" })
        }

        const user = await User.findOne({ username })

        if (!user) {
            return res.status(400).json({ error: "Inavalid user name" })
        }

        if (user.securityKey !== securityKey) {
            return res.status(400).json({ error: "Invalid Security Key !" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        user.password = hashedPassword

        await user.save()

        return res.status(200).json({ message: "Password Updated Successfully" })

    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in auth controller Forget \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
}

export const deleteUser = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    let user // keep reference for cloudinary cleanup

    try {
        const userId = req.user._id
        console.log("Delete User Controller:", userId)

        // Finding user
        user = await User.findById(userId).session(session)
        if (!user) {
            throw new Error("USER_NOT_FOUND")
        }

        // fetching all class IDs
        const classIds = user.classes || []

        if (classIds.length > 0) {
            const classes = await Class.find({ _id: { $in: classIds } }).session(session)

            const allStudentIds = []
            const allAttendanceIds = []

            classes.forEach(cls => {
                allStudentIds.push(...cls.students)
                allAttendanceIds.push(...cls.attendance)
            })

            if (allAttendanceIds.length) {
                await Attendance.deleteMany(
                    { _id: { $in: allAttendanceIds } },
                    { session }
                )
            }

            if (allStudentIds.length) {
                await Student.deleteMany(
                    { _id: { $in: allStudentIds } },
                    { session }
                )
            }

            await Class.deleteMany(
                { _id: { $in: classIds } },
                { session }
            )

            await Student.updateMany(
                {},
                { $pull: { classList: { classId: { $in: classIds } } } },
                { session }
            )
        }

        // Deleting user
        await User.findByIdAndDelete(user._id, { session })

        //Commiting transaction DB work
        await session.commitTransaction()

    } catch (err) {
        if (session.inTransaction()) {
            await session.abortTransaction()
        }

        // console.error("Delete User Error:", err)

        if (err.message === "USER_NOT_FOUND") {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(500).json({ message: "Server error while deleting user" })
    } finally {
        session.endSession()
    }

    // cloudinary cleanup AFTER transaction
    try {
        if (user?.profile?.public_id) {
            await uploadToCloudinary.uploader.destroy(user.profile.public_id)
        }
    } catch (cloudErr) {
        console.error("Cloudinary cleanup failed:", cloudErr)
        // Optional: log to monitoring service
    }

    res.status(200).json({
        message: "User and all related data deleted successfully"
    })
}

export const logout = async (req, res) => {
    try {
        // res.cookie("jwt", "", {
        //     maxAge: 0
        // })

        res.status(200).json({ message: "Logout Successfully !!" })

    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in auth controller Logout \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
}

