import dotenv from "dotenv";
dotenv.config();


import { v2 as cloudinary } from "cloudinary";
import fs from 'fs'

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadOnCloudinary=async (localFilePath)=>{
//   console.log("ENV CHECK:");
// console.log("CLOUD_NAME:",process.env.CLOUD_NAME);
// console.log("CLOUD_API_KEY:",process.env.CLOUD_API_KEY);
// console.log("CLOUD_API_SECRET:",process.env.CLOUD_API_SECRET);

  try {
    if(!localFilePath) return null;
    const response=await cloudinary.uploader.upload(
      localFilePath,
      {resource_type:"auto"}
    )
    console.log("File uploaded successfully",response.url)
    fs.unlinkSync(localFilePath);
    return response
  } catch (error) {
    console.log("Cloudinary Upload Error FULL:", error); 
    fs.unlinkSync(localFilePath)
    return null;
  }
}

export default uploadOnCloudinary;
