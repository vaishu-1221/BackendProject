import dotenv from 'dotenv'
dotenv.config();


import { connectDB } from './db/index.js';
import { app } from './app.js';


app.get('/',(req,res)=>{
    res.send("Hii i am Home")
})

connectDB()
.then(()=>{
    app.on("error",error=>{
        console.log("Start errors",error)
    })
    app.listen(3000,()=>{
    console.log("server listening")
})
})
.catch((error)=>{
    console.log("something happened",error)
})


