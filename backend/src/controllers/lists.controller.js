import asyncHandler from '../utils/asyncHandler.js'
import apiError from '../utils/apiError.js'
import { List } from '../models/list.model.js';
import apiResponse from '../utils/apiResponse.js'
import { Board } from '../models/board.model.js';

const createList = asyncHandler(async (req, res) => {
    const { boardId } = req.params;
    const { title } = req.body;

    const board= await Board.findById(boardId);
    if(!board){
        throw new apiError(400, "No such board exists!")
    }

    const userId=req.user?._id;
    const isMember= board.members.some((memberId)=>memberId.toString()===userId.toString());
    if(!isMember){
        throw new apiError(403,"this user is not a member of the board so not permitted to do this action");
    }

    if (!title) {
        throw new apiError(400, "Title is required");
    }

    const list = await List.create({
        title,
        boardId,
    });

    return res.status(201).json(
        new apiResponse(list, 201,  "List created successfully")
    );
});

const getLists = asyncHandler(async (req, res) => {
    const { boardId } = req.params;

    const lists = await List.find({ boardId }).sort({ order: 1 });

    return res.status(200).json(
        new apiResponse(lists, 200,  "Lists fetched successfully")
    );
});

const updateList = asyncHandler(async (req, res) => {
    const { listId } = req.params;
    const { title } = req.body;

    const list= await List.findById(listId);
    if(!list){
        throw new apiError(400, "No such list exists!")
    }

    if (!title) {
        throw new apiError(400, "Title is required");
    }

    //checking member hai ki nai 
    const board= await Board.findById(list.boardId);
    if(!board){
        throw new apiError(400, "No such board exists!")
    }

    const userId=req.user?._id;

    const isMember= board.members.some((memberId)=>memberId.toString()===userId.toString());
    if(!isMember){
        throw new apiError(403,"this user is not a member of the board so not permitted to do this action");
    }

    list.title= title;
    await list.save();

    return res.status(200).json(
        new apiResponse(list, 200, "List updated successfully")
    );
});

const deleteList = asyncHandler(async (req, res) => {
    const { listId } = req.params;

    const list= await List.findById(listId);
    if(!list){
        throw new apiError(400, "No such list exists!")
    }

    const board= await Board.findById(list.boardId);
    if(!board){
        throw new apiError(400, "No such board exists!")
    }

    const userId=req.user?._id;

    const isMember= board.members.some((memberId)=>memberId.toString()===userId.toString());
    if(!isMember){
        throw new apiError(403,"this user is not a member of the board so not permitted to do this action");
    }

    await List.findByIdAndDelete(listId);

    return res.status(200).json(
        new apiResponse({}, 200, "List deleted successfully")
    );
});

export {createList, getLists, updateList, deleteList};



