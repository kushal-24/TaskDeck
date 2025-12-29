import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { List } from "../models/list.model.js";
import { Task } from "../models/task.model.js";
import { Board } from "../models/board.model.js";

const reorderList = asyncHandler(async (req, res, next) => {
    const { boardId } = req.params;
    const { orderedIds } = req.body;

    //check member permissions
    const board = await Board.findById(boardId);
    if (!board) {
        throw new apiError(404, "Board not found");
    }

    //Board membership check
    const userId = req.user._id;
    const isMember = board.members.some(
        memberId => memberId.toString() === userId.toString()
    );
    if (!isMember) {
        throw new apiError(403, "You are not a member of this board");
    }

    if (!orderedIds) {
        throw new apiError(400, "no orderedIds found");
    }

    for (let i = 0; i < orderedIds.length; i++) {
        const listId = orderedIds[i];

        await List.findOneAndUpdate(
            { _id: listId, boardId: boardId },
            { order: i }
        )
    }

    return res.status(200).json(
        new apiResponse({},200, "Lists reordered successfully")
    );

})

const reorderTasks = asyncHandler(async (req, res) => {
    const { listId } = req.params;
    const { orderedIds } = req.body;

    //checking member permissions
    const list = await List.findById(listId);
    if (!list) {
        throw new apiError(404, "List not found");
    }

    const board = await Board.findById(list.boardId);
    if (!board) {
        throw new apiError(404, "Board not found");
    }

    //Board membership check
    const userId = req.user._id;
    const isMember = board.members.some(
        memberId => memberId.toString() === userId.toString()
    );
    if (!isMember) {
        throw new apiError(403, "You are not a member of this board");
    }

    // Step 1: Validate input
    if (!orderedIds || !Array.isArray(orderedIds) || orderedIds.length === 0) {
        throw new apiError(400, "orderedIds array is required");
    }

    // Step 2: Loop through each task ID and set order = index
    for (let i = 0; i < orderedIds.length; i++) {
        const taskId = orderedIds[i];

        await Task.findOneAndUpdate(
            { _id: taskId, listId: listId },  // ensure the task belongs to this list
            { order: i }
        );
    }

    return res.status(200).json(
        new apiResponse([], 200, "Tasks reordered successfully")
    );
});

export{reorderList, reorderTasks}
