import Class from '../models/class.model.js'
import User from '../models/user.model.js'

export const addClass = async (req, res) => {
    try {

        console.log("Request came // ")
        const { name, roomNo, totalClass, subject, timeTable } = req.body
        const user = req.user
        console.log("data : ",req.body)

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
    try {

        const { id } = req.body
        const user = req.user
        // Still incomplete

    } catch (error) {
        console.log("--------------------------------------------------")
        console.log("Error in Class controller DeleteClass \nErron :", error)
        console.log("--------------------------------------------------")
        return res.status(500).json({ error: "Internal Server Error!!" })
    }
}