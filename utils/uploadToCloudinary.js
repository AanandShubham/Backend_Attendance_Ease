// import { v2 as cloudinary } from 'cloudinary'
// import fs from 'fs'

// const uploadToCloudinary = async (filePath) => {

//     cloudinary.config({
//         cloud_name: process.env.cloudinary_cloud_name,
//         api_key: process.env.cloudinary_api_key,
//         api_secret: process.env.cloudinary_api_secret
//     })

//     try {
//         if (!filePath) return null

//         const uploadResult = await cloudinary.uploader.upload(filePath,{
//             resource_type: "auto",
//             folder: "AttendanceEase"
//         })

//         const imageUrl = {secure_url: uploadResult?.secure_url,public_id:uploadResult?.public_id}

//         fs.unlinkSync(filePath)

//         return imageUrl

//     } catch (error) {
//         fs.unlinkSync(filePath)
//         console.log("-------------------------------------\n")
//         console.log("Error in Cludinary upload Function !!\n")
//         console.log("-------------------------------------", error)
//         return null
//     }
// }

// export default uploadToCloudinary 


import cloudinary from "../config/cloudinary.js"
import streamifier from "streamifier"

const uploadToCloudinary = (buffer, folder = "uploads") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }
        )

        streamifier.createReadStream(buffer).pipe(stream)
    })
}
export default uploadToCloudinary 
