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
    subject:{
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
},{timestamps:true})

const Attendance = mongoose.model("Attendance",attendanceSchema)

export default Attendance 