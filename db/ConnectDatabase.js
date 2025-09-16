import mongoose from "mongoose"

const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        // console.log("------------------------------")
        console.log("     Connected to Database")
        console.log("------------------------------")
    } catch (error) {
        console.log("-----------------------------------------")
        console.log("Error in connecting mongodb :-", error)
        console.log("-----------------------------------------")
    }
}

export default connectDatabase