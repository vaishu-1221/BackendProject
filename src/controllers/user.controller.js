import { ApiError } from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const UserRegister=asyncHandler(async(req,res)=>{
    //get data from user
    //validation-email/username
    //check if user already exist
    //file exist or not
    //upload to cloudinary
    //create user object-db entry
    //remove pwd,refresh token from response
    //return response

    const {fullname,email,username,password}=req.body;

    if([fullname,email,username,password].some((field)=>
    field?.trim()===""
    )){
        throw new ApiError(404,"All fields are required");
    }

    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User exist")
    }

    // console.log("FILES:", req.files);
    // console.log("BODY:", req.body);


    const AvatarLocalPath=req.files?.avatar[0]?.path;
    const CoverImageLocalPath=req.files?.coverImage[0]?.path;
    if(!AvatarLocalPath){
        throw new ApiError(404,"Avatar is not found");
    }



    const avatar=await uploadOnCloudinary(AvatarLocalPath)

    //     console.log("Avatar Local Path:", AvatarLocalPath);
    // console.log("Cloudinary Response:", avatar);

    let coverImage;
    if (CoverImageLocalPath) {
    coverImage = await uploadOnCloudinary(CoverImageLocalPath);
    }

    if(!avatar){
        throw new ApiError(404,"Avatar not found")
    }
    
    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"something went wrong in removing pwd & refToken");
    }

    return res.status(201).json(
        new ApiResponse(200,createdUser,"Successfully registered")
    )

})

export {UserRegister}