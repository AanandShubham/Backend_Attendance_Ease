import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const uploadToCloudinary = async (filePath) => {

    cloudinary.config({
        cloud_name: process.env.cloudinary_cloud_name,
        api_key: process.env.cloudinary_api_key,
        api_secret: process.env.cloudinary_api_secret
    })

    try {
        if (!filePath) return null

        const uploadResult = await cloudinary.uploader.upload(filePath)

        const imageUrl = uploadResult?.secure_url

        fs.unlinkSync(filePath)

        return imageUrl

    } catch (error) {
        fs.unlinkSync(filePath)
        console.log("-------------------------------------\n")
        console.log("Error in Cludinary upload Function !!\n")
        console.log("-------------------------------------", error)
        return null
    }
}

export default uploadToCloudinary 