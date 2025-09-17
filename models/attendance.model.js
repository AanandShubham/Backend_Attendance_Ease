import mongoose from "mongoose"

const attendanceSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true
    },
    Subject:{
        type:String,
        required:true
    },
    roomNo:{
        type:Number,
        required:true
    },
    students:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Student"
        }
    ]
})

const Attendance = mongoose.model("Attendance",attendanceSchema)

export default Attendance 