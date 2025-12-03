import mongoose from 'mongoose'
import Class from '../models/class.model.js'
import Student from '..models/student.model.js'


export const getDetails = async (req, res) => {
    try {
        const classId = req.params.id
        const classDetails = await Class.findById(classId)
            .populate({
                path: "students",
                options: { sort: { tca: 1 } }   // sort inside populate
            })
            .populate({
                path: "attendance",               // populate the attendance array
                options: { sort: { createdAt: -1 } }
            })

        // const classDetails = await Class.findById(classId)
        //     .populate({
        //         path: "students",
        //         populate: ({path:"classList._id"})
        //     })
        //     .populate({
        //         path: "attendance",               // populate the attendance array
        //         populate: {
        //             path: "students",               // populate the students inside each attendance record
        //             model: "Student",               // model name
        //             select: "name tca"              // optional: select fields you want
        //         }
        //     })


        if (!classDetails) {
            return res.status(400).json({ error: "Invalid Class Id" })
        }

        // console.log("-------------------------------------------")
        // console.log("Class Details : ", JSON.stringify(classDetails,null,2))
        // console.log("-------------------------------------------")

        return res.status(200).json(
            {
                attendances: classDetails.attendance,
                students: classDetails.students
            }
        )

    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in Class controller AddClass \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
}

export const addClass = async (req, res) => {

    try {

        const { name, roomNo, totalClass, subject, timeTable } = req.body
        const user = req.user

        const newClass = await Class.create(
            {
                name,
                roomNo,
                totalClass,
                subject,
                timeTable
            })

        if (!newClass) {
            return res.status(401).json({ error: "Problem in Add Class details" })
        }

        await user.classes.push(newClass._id)
        await user.save()

        return res.status(201).json({ newClass })

    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in Class controller AddClass \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
}

export const updateClass = async (req, res) => {
    try {
        const { id, name, roomNo, totalClass, subject, timeTable } = req.body
        // const user = req.user

        const updatedClass = await Class.findByIdAndUpdate(
            id,
            {
                name,
                roomNo,
                totalClass,
                subject,
                timeTable
            }, { new: true })
        if (!updateClass) {
            return res.status(401).json({ error: "Class id not valid" })
        }

        return res.status(202).json({ updatedClass })

    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in Class controller EditClass \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
}

export const deleteClass = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction() // starting session for atomicity

    try {
        const classId = req.params.id
        const user = req.user

        const deletedClass = await Class.findByIdAndDelete(classId).session(session)

        if (!deletedClass) {
            await session.abortTransaction()
            return res.status(401).json({ error: "Class id not valid" })
        }

        // Remove class reference from user's classes array
        user.classes = user.classes.filter(cId => cId.toString() !== classId)
        await user.save().session(session)

        const student = await Student.updateMany(
            { classList: classId },
            { $pull: { classList: classId } }
        ).session(session)

        if (student.nModified === 0) {
            await session.abortTransaction()
            return res.status(400).json({ error: "No students were enrolled in this class" })
        }

        return res.status(200).json({ message: "Class deleted successfully" })



    } catch (error) {
        await session.abortTransaction()
        console.log("--------------------------------------------------")
        console.log("Error in Class controller DeleteClass \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }finally{
        session.endSession()
    }
}