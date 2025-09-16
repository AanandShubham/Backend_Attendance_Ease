import mongoose from "mongoose"

const classSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    roomNo:{
        type:Number,
        required:true
    },
    totalClass:{
        type:Number,
        required:true,
        default:0
    },
    timeTable:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        required:true
    },
    students:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Student",
            default:[]
        }
    ],
    attendance:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Attendance",
            default:[]
        }
    ]
},{timestamps:true})

const Class = mongoose.model("Class",classSchema)

export default Class               