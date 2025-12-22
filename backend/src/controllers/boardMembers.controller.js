import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Board } from "../models/board.model.js";
import { User } from "../models/user.model.js"

const addMember=asyncHandler(async(req,res,next)=>{
    const {boardId}=req.params;
    const board= await Board.findById(boardId);

    if(!board){
        throw new apiError(400, "Board was not found !");
    }
    const ownerId=req.user?._id;
    if(ownerId.toString()!==board.ownerId.toString()){
        throw new apiError(400, "you cant add or remve members as you're not the owner of this board");
    }

    const {userEmail}=req.body;

    const user= await User.findOne({ email: userEmail });

    const isAlreadyMember= board.members.some((memberId)=>memberId.toString()===user._id.toString());
    if(isAlreadyMember){
        throw new apiError(403,"this user is already a member of the board");
    }

    board.members.push(user._id);
    await board.save();

    return res
    .json(
        new apiResponse(board, 200, "member has been added successfully")
    )
})

const removeMember=asyncHandler(async(req,res,next)=>{
    const {boardId}=req.params;
    const board= await Board.findById(boardId);

    if(!board){
        throw new apiError(400, "Board was not found !");
    }
    const ownerId=req.user?._id;
    if(ownerId.toString()!==board.ownerId.toString()){
        throw new apiError(400, "you cant add or remove members as you're not the owner of this board");
    }

    const {userEmail}=req.body;
    if (!user) {
        throw new apiError(404, "User not found");
    }

    if (user._id.toString() === board.ownerId.toString()) {
        throw new apiError(400, "Owner cannot be removed from the board");
    }

    const user= await User.findOne({ email: userEmail });

    const isMember= board.members.some((memberId)=>memberId.toString()===user._id.toString());
    if(!isMember){
        throw new apiError(403,"this user is already not a member of the board");
    }

    board.members= board.members.filter((memberId)=>memberId.toString()!==user._id.toString())
    await board.save();

    return res
    .json(
        new apiResponse(board, 200, "member has been added successfully")
    )
})

export{
    addMember,
    removeMember
}