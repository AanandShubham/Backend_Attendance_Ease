import Attendance from "../models/attendance.model.js"
import Class from "../models/class.model.js"
import Student from "../models/student.model.js"
import mongoose from "mongoose"

export const addAttendance = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction() // starting session for atomicity
    try {

        const { name, time, subject, roomNo, students, attendanceList, classId } = req.body

        console.log("-----------------------------------------")
        console.log("Addtendace Data : ", JSON.stringify(req.body, null, 2))
        console.log("-----------------------------------------")


        if (!Array.isArray(students) || students.length === 0) {
            await session.abortTransaction()
            return res.status(400).json({ error: "Students can't be empty" })
        }

        const attendanceArr = await Attendance.create(
            [{ name, time, subject, roomNo, students:attendanceList }],
            { session }
        )

        const attendance = attendanceArr[0] // session returns array so we need to do this

        if (!attendance) {
            await session.abortTransaction()
            return res.status(400).json({ error: "Error creating attendance" })
        }

        // update class with attendance id 
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { $push: { attendance: attendance._id } },
            { new: true, session }
        )

        if (!updatedClass) {
            await session.abortTransaction()
            return res.status(400).json({ error: "Invalid Class id" })
        }

        // update student with bulkwrite 
        const bulkOps = students.map(stu => ({
            updateOne: {
                filter: { _id: stu._id },
                update: { $set: stu }
            }
        }))

        const result = await Student.bulkWrite(bulkOps, { session })

        if (result.matchedCount !== students.length) {
            await session.abortTransaction()
            return res.status(400).json({ error: "Error updating students" })
        }

        await session.commitTransaction()

        console.log("**********************************************")
        console.log("After Adding attendance as response  : ", JSON.stringify(attendance, null, 2))
        console.log("**********************************************")

        console.log("**********************************************")
        console.log("After adding Attendance Class Data as Response : ", JSON.stringify(updatedClass, null, 2))
        console.log("**********************************************")



        return res.status(201).json({ attendance, updatedClass })

    } catch (error) {
        await session.abortTransaction()
        console.log("--------------------------------------------------")
        console.log("Error in Attendance controller Add Attendance \nError :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    } finally {
        session.endSession()
    }
}

export const deleteAttendance = async (req, res) => {
    try {

        const { attendanceId, classId } = req.body

        // const attendance = await Attendance.findByIdAndDelete(attendanceId)
        // const updatedClass = await Class.findByIdAndUpdate(
        //     classId,
        //     {
        //         $pull: {
        //             attendance: attendanceId
        //         }
        //     }, { new: true })

        const attendance = await Attendance.findById(attendanceId)

        if (!attendance) {
            return res.status(400).json({ error: "Invalid Attendance id" })
        }

        const updatedClass = await Class.findById(classId)

        if (!updatedClass) {
            return res.status(400).json({ error: "Invalid Class id" })
        }

        await attendance.deleteOne()

        updatedClass.attendance = updatedClass.attendance.filter(
            (atd) => atd.toString() !== attendanceId.toString()
        )

        await updatedClass.save()

        return res.status(200).json({ message: "attendance deleted", classes: updatedClass })

    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in Attendance controller Delete Attendance \nError :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
}