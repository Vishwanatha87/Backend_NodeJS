import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from '../utils/ApiError.js'
import {User} from '../models/user.models.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'


const registeruser = asyncHandler(async (req, res) => {
    const {fullname, email, username, password} = req.body

    // validation
    if(
        [fullname,username,email,password].some((field) => field?.trim() ==="")
    ){
        throw new ApiError(400,"All field are required")
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(409, "avatar file is missing")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverLocalPath)

    const user = await User.create({
        fullname,
        avatar:avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.tolowerCase()
    })

    const createdUser = await User.findById(user_id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(200, createdUser, "User registered successfully")
    

})


export{
    registeruser
}