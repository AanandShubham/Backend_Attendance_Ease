import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    fullname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    securityKey:{
        type:String,
        required:true
    },
    classes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Class",
            default:[]
        }
    ],
    profile:{
        type:String,
        default:""
    }

},{timestamps:true})

const User = mongoose.model("User",userSchema)

export default User
