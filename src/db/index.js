import mongoose from 'mongoose'

export const connectDB=async()=>{
   try {
        const connectionInstance=await mongoose.connect(`${process.env.DB_URL}`)
        console.log(`connected DB ${connectionInstance.connection.host} `)
   } catch (error) {
    console.log("Mongo Failed",error)
    process.exit(1);
   }
}

