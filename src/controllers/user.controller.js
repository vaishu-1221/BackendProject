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

    const generateAccessAndRefreshToken=async(userId)=>{
            try {
                const accessToken=await user.generateAccessToken()
                const refreshToken=await user.generateRefreshToken()

                user.refreshToken=refreshToken

                await User.save({validateBeforeSave:false})

                return {accessToken,refreshToken}
            } catch (error) {
                console.error("Something went wrong in login",error);
            }
    }

const UserLogin=asyncHandler(async(req,res)=>{
    //get data-from body
    //email||username exist
    //find user
    //password check
    //access & refresh Token generate
    //send access & refresh Token cookies

    const {email,username,password}=req.body

    if(!username || !email){
        throw new ApiError(400,"username or email required")
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })
    if(!user){
        throw new ApiError(404,"user not found")
    }

    const isPasswordValid=user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(400,"Password is invalid")
    }


    const {accessToken,refreshToken}=generateAccessAndRefreshToken(user._id)

    const loggedInUser=await User.findById(user._id)
    const options={
        httpOnly:true,
        secure:true
    }
    return res.status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)
            .json(new ApiResponse(200,
                {
                    user:loggedInUser,accessToken,refreshToken
                },
                "User login Successfully"
            ))

})

const UserLogout=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{refreshToken:undefined}
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"))
})

export {UserRegister,UserLogin,UserLogout}