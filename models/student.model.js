import mongoose from "mongoose"

const studentSchema = new mongoose.Schema({
    tca: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        set: v => v.toUpperCase()
    },
    name: {
        type: String,
        required: true
    },
    classList: [
        {
            totalAttendance: {
                type: Number,
                required: true,
                default: 0,
                min: [0, "Attendance can't be negative"]
            },
            classId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Class',
                required: true
            }
        }
    ]
}, { timestamps: true })

const Student = mongoose.model("Student", studentSchema)

export default Student 