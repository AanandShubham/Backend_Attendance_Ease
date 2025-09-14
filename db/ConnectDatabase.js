import mongoose from "mongoose"

const connectDatabase = async () => {
    try {
        await mongoose.connect("mongodb+srv://anandsinghhum_db_user:VDlCWqQGw8vf1WUm@cluster0.n03emlm.mongodb.net/Attendance-Ease-Db?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log("Error :-",error)
    }
}

export default connectDatabase