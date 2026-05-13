import { Board } from "../models/board.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js"

const createBoard = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if ([title, description].some((item) => item.trim() == "")) {
        throw new apiError(400, "details are incomplete owner");
    }
    const existingBoard = await Board.findOne({ title });

    if (existingBoard) {
        throw new apiError(400, "Board with the given name already exists");
    }

    const board = await Board.create({
        title,
        description,
        ownerId: req.user?._id,
        members: [req.user?._id]
    })

    const createdBoard = board;
    if (!createdBoard) {
        throw new apiError(createBoard, 500, "New board wasn't created")
    }

    return res
        .status(200)
        .json(
            new apiResponse(200, createdBoard, "board has been created successfully")
        )
})

const getBoard = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    const board = await Board.findById(boardId)
    .populate("members", "fullName email")
    .populate("ownerId", "fullName")

    if (!board) {
        throw new apiError(400, "no such board exists, sorry");
    }

    return res
        .status(200)
        .json(
            new apiResponse(
                board,
                200,
                "all board details fetched successfully"
            )
        )
})

const updateBoard = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const board = await Board.findById(boardId);
    if (!board) {
        throw new apiError(404, "no board was founf");
    }

    const userId = req.user?._id;
    if (userId.toString() !== board.ownerId.toString()) {
        throw new apiError(403, "you dont have the permissions as you're not the owner of this board")
    }


    const { description, title } = req.body;

    if ([title, description].some((field) => field?.trim() === "")) {
        throw new apiError(400, "Fields cannot be empty");
    }

    board.title = title;
    board.description = description;

    await board.save();

    return res
        .status(200)
        .json(
            new apiResponse(
                board,
                200,
                "board details are updated successfully"
            )
        )
})

const deleteBoard = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    const board = await Board.findById(boardId);

    if (!board) {
        throw new apiError(404, "No board found with the given title");
    }

    const userId = req.user?._id;
    if (userId.toString() !== board.ownerId.toString()) {
        throw new apiError(403, "You do not have permission to delete this board. Only the board owner can delete it.");
    }

    await Board.findByIdAndDelete(boardId);

    return res.status(200).json(
        new apiResponse({}, 200, "Board deleted successfully")
    );
});

const getAllBoards = asyncHandler(async (req, res, next) => {
    const userId = req.user?._id;
    const boardsList = await Board.find({
        $or: [
            { ownerId: userId },
            { members: userId }
        ]
    })
    if (!boardsList) {
        throw new apiError(404, "Boards were not fetched");
    }

    return res
        .status(200)
        .json(
            new apiResponse(boardsList, 200, "All boards belonging to the user as member/owner fetched successfully")
        )
})

export { createBoard, updateBoard, getBoard, deleteBoard, getAllBoards };