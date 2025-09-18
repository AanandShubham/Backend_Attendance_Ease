import Attendance from "../models/attendance.model.js"
import Class from "../models/class.model.js"

export const addAttendance = async (req, res) => {
    try {

        const { name, time, subject, roomNo, students, classId } = req.body

        if (!students) {
            return res.status(400).json({ error: "Error !! Students can't be empty" })
        }

        const attendance = await Attendance.create({ name, time, subject, roomNo, students })

        if (!attendance) {
            return res.status(400).json({ error: "Invalid attendance Details" })
        }

        const updatedClass = await Class.findByIdAndDelete(
            classId,
            {
                $push: {
                    attendance: attendance._id
                }
            }, { new: true })

        if (!updatedClass) {
            return res.status(400).json({ error: "Invalid Class id" })
        }

        return res.status(201).json({ message: "attendance generated and saved", classes: updatedClass })

    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in Attendance controller Add Attendance \nError :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
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

        if(!attendance){
            return res.status(400).json({error:"Invalid Attendance id"})
        }

        const updatedClass = await Class.findById(classId)

        if(!updatedClass){
            return res.status(400).json({error:"Invalid Class id"})
        }

        await attendance.deleteOne()

        updatedClass.attendance = updatedClass.attendance.filter(
            (atd)=> atd.toString() !== attendanceId.toString()
        )

        await updatedClass.save()

        return res.status(200).json({message:"attendance deleted",classes:updatedClass})

    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in Attendance controller Delete Attendance \nError :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
}