import cookieParser from "cookie-parser"
import express from "express"
import authRoute from './routes/auth.routes.js'
import connectDatabase from './db/ConnectDatabase.js'
import dotenv from 'dotenv'

dotenv.config({})


const app = express()

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoute)

app.get("/", (req, res) => {
    res.send("Hello Ashish")
})

app.listen(3000, (err) => {
    console.log("---------------------------------------")
    console.log("Running at :- http://localhost:3000    ")
    console.log("---------------------------------------")
    connectDatabase()

})