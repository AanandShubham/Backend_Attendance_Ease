import mongoose from "mongoose"
import Class from "../models/class.model.js"
import Student from "../models/student.model.js"

export const addStudent = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction() // starting session for atomicity

    try {
        const { tca, name, totalAttendance = 0, classId } = req.body

        const classes = await Class.findById(classId).session(session)

        if (!classes) {
            await session.abortTransaction()
            // session.endSession()
            return res.status(400).json({ error: "invalid class id" })
        }

        let student = await Student.findOne({ tca }).session(session)


        if (student) {

            const isClassAlreadySelected = student.classList.some((cls) => cls.classId.toString === classId.toString)

            if (!isClassAlreadySelected) {
                student.classList.push({ totalAttendance, classId })
                await student.save({ session })
            }

        } else {

            student = await Student.create([
                { tca, name, classList: [{ totalAttendance, classId }] }
            ], { session })

            student = student[0] // session returns array so we need to do this 
        }

        const std_id = student._id
        const isStudentInClassAlready = classes.students.some((std) => std.id.toString === std_id.toString)

        if (!isStudentInClassAlready) {
            classes.students.push(std_id)
            await classes.save({ session })
        }

        await session.commitTransaction()
        // session.endSession()

        return res.status(201).json({ classes, student })

    } catch (error) {
        await session.abortTransaction()
        // session.endSession()
        console.log("--------------------------------------------------")
        console.log("Error in Student controller AddStudent \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
    finally {
        session.endSession()
    }
}

export const editStudent = async (req, res) => {
    try {
        const { id, newAttendance, classId } = req.body
        const classes = await Class.findById(classId)

        if (!classes) {
            return res.status(400).json({ error: "Class not available" })
        }

        if (classes.totalClass < newAttendance) {
            return res.status(400).json({ error: "Student's attendance can't be more than the total class" })
        }

        const student = await Student.findById(id)

        if (!student) {
            return res.status(401).json({ error: "Invalid StudentId" })
        }

        student.classList.some((clslist) => {
            if (clslist.classId.equals(classId))
                clslist.totalAttendance = newAttendance
        })
        await student.save()

        return res.status(201).json({ student })
    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in Student controller AddStudent \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
}

export const deleteStudent = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { id, classId } = req.body

        const classes = await Class.findById(classId).session(session)

        if (!classes) {
            await session.abortTransaction()
            return res.status(400).json({ error: "Invalid Class id" })
        }

        // const student = await Student.findByIdAndUpdate(id,{
        //     $pull:{
        //         classList:{classId:classId}
        //     }
        // },{new:true,session})

        const student = await Student.findById(id).session(session)

        if (!student) {
            await session.abortTransaction()
            return res.status(400).json({ error: "Invalid Student id" })
        }

        // clsss removed from student object
        student.classList = student.classList.filter(
            (cls) => cls.classId.toString() !== classId.toString()
        )

        // student removed from class 
        classes.students = classes.students.filter(
            (std) => std.toString() !== id.toString()
        )

        await student.save({ session })
        if (student.classList.length === 0) {
            await student.deleteOne({ session })
        }
        await classes.save({ session })

        await session.commitTransaction()

        res.status(200).json({ message: "Student removed Successfully", classes })

    } catch (error) {
        await session.abortTransaction()
        console.log("--------------------------------------------------")
        console.log("Error in Student controller Delete Student \nError :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
    finally {
        session.endSession()
    }
}

