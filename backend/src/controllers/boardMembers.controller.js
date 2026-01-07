import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Board } from "../models/board.model.js";
import { User } from "../models/user.model.js"

const addMember = asyncHandler(async (req, res, next) => {
    const { boardId } = req.params;
    const board = await Board.findById(boardId);

    if (!board) {
        throw new apiError(400, "Board was not found !");
    }
    const ownerId = req.user?._id;
    if (ownerId.toString() !== board.ownerId.toString()) {
        throw new apiError(400, "you cant add or remve members as you're not the owner of this board");
    }

    const { userId } = req.body;

    const isAlreadyMember = board.members.some((memberId) => memberId.toString() === userId.toString());
    if (isAlreadyMember) {
        throw new apiError(403, "this user is already a member of the board");
    }

    board.members.push(userId);
    await board.save();

    return res
        .json(
            new apiResponse(board, 200, "member has been added successfully")
        )
})

const removeMember = asyncHandler(async (req, res, next) => {
    const { boardId } = req.params;
    const board = await Board.findById(boardId);

    if (!board) {
        throw new apiError(400, "Board was not found !");
    }
    const ownerId = req.user?._id;
    if (ownerId.toString() !== board.ownerId.toString()) {
        throw new apiError(400, "you cant add or remove members as you're not the owner of this board");
    }

    const { userId } = req.params;
    if (!userId) {
        throw new apiError(404, "User not found");
    }

    if (userId.toString() === board.ownerId.toString()) {
        throw new apiError(400, "Owner cannot be removed from the board");
    }

    const isMember = board.members.some((memberId) => memberId.toString() === userId.toString());
    if (!isMember) {
        throw new apiError(403, "this user is already not a member of the board");
    }

    board.members = board.members.filter((memberId) => memberId.toString() !== userId.toString())
    await board.save();

    return res
        .json(
            new apiResponse(board, 200, "member has been removed successfully")
        )
})


const getBoardMembers = async (req, res) => {
    const { boardId } = req.params;
    const userId = req.user._id;

    const board = await Board.findById(boardId)
        .populate("members", "fullName email")
        .populate("ownerId", "fullName email");

    if (!board) {
        return res.status(404).json({
            success: false,
            message: "Board not found",
        });
    }

    const isMember =
        board.ownerId.toString() === userId.toString() ||
        board.members.some(
            (member) => member._id.toString() === userId.toString()
        );

    if (!isMember) {
        return res.status(403).json({
            success: false,
            message: "Not authorized to view board members",
        });
    }

    const members = [...board.members];

    if (!members) {
        throw new apiError(500, "server error");
    }

    return res
        .json(
            new apiResponse(
                members,
                200,
                "members fetched successfully"
            )
        )
}


export {
    addMember,
    removeMember,
    getBoardMembers,
}