import cookieParser from "cookie-parser"
import express from "express"
import authRoute from './routes/auth.routes.js'
import classRoute from './routes/classes.routes.js'
import studentRoute from './routes/student.routes.js'
import attendanceRoute from './routes/attendance.routes.js'
import connectDatabase from './db/ConnectDatabase.js'
import dotenv from 'dotenv'

dotenv.config({})

const PORT = process.env.PORT || 3000 
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoute)
app.use("/api/class",classRoute)
app.use("/api/student",studentRoute)
app.use("/api/attendance",attendanceRoute)

app.get("/", (req, res) => {
    res.send("Hello Developer")
})

app.listen(PORT, (err) => {
    console.log("---------------------------------------")
    console.log("Running at :- http://localhost:3000    ")
    console.log("---------------------------------------")
    connectDatabase()

})