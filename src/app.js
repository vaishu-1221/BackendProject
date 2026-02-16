import express from 'express'
import cookieparser from 'cookie-parser'
import cors from 'cors'

const app=express();

app.use(cors({credentials:true}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieparser())



//router import
import userRouter from "./routes/user.routes.js"

//router declare
app.use("/api/v1/users",userRouter);

export {app};