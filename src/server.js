import dotenv from 'dotenv'
dotenv.config();

import express from 'express'
import { connectDB } from './db/index.js';


connectDB();
const app=express();

app.get('/',(req,res)=>{
    res.send("Hii i am Home")
})

app.listen(3000,()=>{
    console.log("server listening")
})