import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new apiError(404, "User not found");
        }

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        console.error("Error generating tokens:", error);
        throw new apiError(500, "Error generating tokens");
    }
};

const createUser = asyncHandler(async (req, res, next) => {
    const {fullName, email,password} = req.body;
    //for extracting details in form data

    if ([fullName, email, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "invalid details")
    }

    const existedUser = await User.findOne({ email })
    if (existedUser) {
        throw new apiError(401, "This User already exists, pls login instead");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new apiError(500, "Something went wrong while registering the user")
    }

    return res
        .status(201)
        .json(
            new apiResponse(createdUser ,201, "User registered successfully")
        )
})

const userLogin = asyncHandler(async (req, res, next) => {
    const {email, password } = req.body;
    if (!email) {
        throw new apiError(400, "Fill in the details first")
    }
    const user = await User.findOne({email})

    if (!user) {
        throw new apiError(404, "No user registered found");
    }

    const isPasswordValid = await user.isPassCorrect(password)

    if (!isPasswordValid) {
        throw new apiError(400, "go away, wrong password, no more chances")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                {
                    user: loggedInUser,
                    accessToken, refreshToken
                },
                200,
                "LOGGED IN"
            )
        )
})

const userLogout = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: "",

            }
        },
        {
            new: true//to return the new document
        }
    )
    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse( {} ,200, "logged out, User "))

})

const changeUserPass = asyncHandler(async (req, res, next) => {
    /**
     1. req for username or email and password, new password
     2. if user wrong, error
     3. if pasword wrong, error
     4. new password =this.password
     */

    const {email, password, newPassword, confirmNewPassword } = req.body;
    if(!email){
        throw new apiError(400, "no email entered!");
    }
    
    const user = await User.findOne({email})
    if(!user){
        throw new apiError(400, "no user found");
    }

    const isPasswordCorrect= await user.isPassCorrect(password);
    if(!isPasswordCorrect){
        throw new apiError(401, "wrong password lil bro");
    }

    if(!(newPassword===confirmNewPassword)){
        throw new apiError(400, "passwords dont match ");
    }

    user.password= confirmNewPassword;
    await user.save({validateBeforeSave: false});

    return res
    .status(200)
    .json(
        new apiResponse(
            {},
            200,
            "Password has been updated successfully yeahhyeahhh"
        )
    )

})

const getUserDetails= asyncHandler(async(req,res,next)=>{
    const userId= req.user?._id;
    const user= await User.findById(userId).select("-password -refreshToken");
    if(!user){
        throw new apiError(401, "server error hogaya");
    }

    return res
    .status(200)
    .json(
        new apiResponse(
            user,
            200,
            "Admin details fetched successfully"
        )
    )
})

const deleteUser=asyncHandler(async(req,res,next)=>{
    const userId=req.user?._id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if(!deleteUser){
        throw new apiError(400, "user not found");
    }
    return res
        .status(200)
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(
            new apiResponse( {}, 200, "Account deleted successfully")
        );
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorised request brother");//token hi sahi nai hai 
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new apiError(401, "no user found or some changes made");//user hi nai hai 
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, "no user found or some changes made");//user hi nai hai 
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newrefreshToken } = generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newrefreshToken, options)
            .json(
                new apiResponse(
                    200,
                    { accessToken, newrefreshToken },
                    "Access token is refreshed"
                )
            )
    } catch (error) {
        throw new apiError(400, error?.message || "invalid refresh token")
    }
})

export {
    refreshAccessToken,
    deleteUser,
    getUserDetails,
    changeUserPass,
    userLogout,
    userLogin,
    createUser,
    generateAccessAndRefreshToken,
}