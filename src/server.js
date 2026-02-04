import express from 'express'

const app=express();

app.get('/',(req,res)=>{
    res.send("Hii i am Home")
})

app.listen(3000,()=>{
    console.log("server listening")
})