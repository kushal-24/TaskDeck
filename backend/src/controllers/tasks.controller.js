import { Task } from "../models/task.model.js";
import{ Comment } from "../models/comment.model.js"
import { Attachment } from "../models/attachment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { User } from "../models/user.model.js";
import {List} from "../models/list.model.js"
import {Board} from "../models/board.model.js"
import mongoose from "mongoose";


const createTask = asyncHandler(async (req, res) => {
    const { listId } = req.params;
    const { title, description, priority, dueDate } = req.body;
  
    if (!req.user) {
      throw new apiError(401, "Unauthorized");
    }
  
    if (!title || !description) {
      throw new apiError(400, "Title and description are required");
    }
  
    const list = await List.findById(listId);
    if (!list) {
      throw new apiError(404, "List not found");
    }
  
    const board = await Board.findById(list.boardId);
    if (!board) {
      throw new apiError(404, "Board not found");
    }
  
    const userId = req.user._id;
    const isMember = board.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );
  
    if (!isMember) {
      throw new apiError(403, "User is not a board member");
    }
  
    const task = await Task.create({
      title,
      description,
      priority,
      dueDate,
      status: "todo",
      order: 0,
      listId,
      createdBy: userId,
      assignees: [req.user?._id]
    });
  
    return res.status(201).json(
      new apiResponse(task, 201, "Task created successfully")
    );
  });
  
const getTasks = asyncHandler(async (req, res) => {
    const { listId } = req.params;

    const tasks = await Task.find({ listId }).sort({ order: 1 });

    if(!tasks){
        throw new apiError(400, "server error in finding tasks");
    }

    return res.status(200).json(
        new apiResponse(tasks,200, "Tasks fetched successfully")
    );
});

const updateTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const updateData = req.body; //Because right now your task system is basic, and flexibility helps.

    const task= await Task.findById(taskId);
    if(!task){
        throw new apiError(400, "task not found");
    }
    
    const listId= task.listId
    const list= await List.findById(listId);
    if(!list){
        throw new apiError(400, "list not found");
    }

    const board= await Board.findById(list.boardId);
    if(!board){
        throw new apiError(400, "board not found");
    }

    const userId=req.user?._id;
    const isMember= board.members.some((memberId)=>memberId.toString()===userId.toString());
    if(!isMember){
        throw new apiError(403,"this user is not a member of the board so cant do any actions");
    }

    const updated = await Task.findByIdAndUpdate(
        taskId,
        updateData,
        { new: true }
    );

    return res.status(200).json(
        new apiResponse(updated, 200,  "Task updated successfully")
    );
});

const deleteTask = asyncHandler(async (req, res) => {
    const {taskId} = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
        throw new apiError(404, "Task not found");
    }

    const list = await List.findById(task.listId);
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

    await Task.findByIdAndDelete(taskId);

    return res.status(200).json(
        new apiResponse({}, 200, "Task deleted successfully")
    );
});

const updateTaskStatus=asyncHandler(async(req,res,next)=>{
    const {taskId}=req.params;

    //member check permissions
    const task = await Task.findById(taskId);
    if (!task) {
        throw new apiError(404, "Task not found");
    }

    const list = await List.findById(task.listId);
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


    const {status}=req.body;

    if (!["todo", "in_progress", "review", "done"].includes(status)) {
        throw new apiError(400, "Invalid task status");
    }

    if(!task){
        throw new apiError(400, "sorry task wasnt found");
    }

    if(!task.assignees.some(id => id.toString() === userId.toString())){
        throw new apiError(403, "this user is not assigned any task so cant change its status");
    }

    const updatedStatus= await Task.findByIdAndUpdate(
        taskId,
        status,
        {new: true}
    );

    
    if (!updatedStatus) {
        throw new apiError(404, "Task status cudn't be changed");
    }

    const activityLog= await ActivityLog.create({
        actionType: "STATUS_CHANGED",
        entityType: "TASK",
        entityId: task._id,
        performedBy: req.user?._id,
        taskId: task._id,
        message: `Task status was updated`
    })

    if(!activityLog){
        throw new apiError(500, "server error in creating an activity log");
    }

    return res.status(200).json(
        new apiResponse({updatedStatus, activityLog}, 200 , "Task updated successfully")
    );
})

const getTaskById = asyncHandler( async (req, res) => {
    const { taskId } = req.params;
    const userId = req.user._id;
  
    // 1️⃣ Fetch task with all required relations
    const task = await Task.findById(taskId)
      .populate("assignees", "fullName email")
      .populate("createdBy", "fullName email")
      .populate("listId", "_id title" )
  
    if (!task) {
      throw new apiError(404, "Task not found");
    }
  
    // 2️⃣ Fetch list → board (permission check)
    const list = await List.findById(task.listId);
    if (!list) {
      throw new apiError(404, "List not found");
    }
  
    const board = await Board.findById(list.boardId);
    if (!board) {
      throw new apiError(404, "Board not found");
    }
  
    // 3️⃣ Board membership check
    const isBoardMember = board.members.some(
      (id) => id.toString() === userId.toString()
    );
  
    if (!isBoardMember) {
      throw new apiError(403, "You are not allowed to view this task");
    }
  
    // 4️⃣ Send fully hydrated task
    return res.status(200).json(
      new apiResponse(task, 200, "Task fetched successfully")
    );
  });

//////////////////////////////////////////////////////////////////// COMMENTS

const addComment=asyncHandler(async(req,res,next)=>{
    const {taskId}=req.params;
    
    const task=await Task.findById(taskId);
    if(!task){
        throw new apiError(400, "couldnt find the task");
    }

    const list = await List.findById(task.listId);
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

   
    const user= await User.findById(userId)
    
    if(!task.assignees.includes(userId)){
        throw new apiError(403,"only assignees can comment here, sorry ")
    }

    const{content}=req.body;
    const newComment= await Comment.create({
        taskId: taskId,
        userId: userId,
        content: content
    })

    if(!newComment){
        throw new apiError(500, "Something went wrong :|");
    }

    const activityLog= await ActivityLog.create({
        actionType: "COMMENT_ADDED",
        entityType: "TASK",
        entityId: task._id,
        performedBy: req.user?._id,
        taskId: task._id,
        message: `A new comment was added to this task by ${user.fullName}`
    })

    if(!activityLog){
        throw new apiError(500, "server error in creating an activity log");
    }

    return res
    .status(200)
    .json(
        new apiResponse({newComment,activityLog}, 200, `comment has been created successfully`)
    )

})

const editComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new apiError(404, "Comment not found");
    }

    // Only comment author can edit
    if (comment.userId.toString() !== userId.toString()) {
        throw new apiError(403, "You can edit only your own comment");
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json(
        new apiResponse(comment, 200,  "Comment updated successfully")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new apiError(404, "Comment not found");
    }

    const task = await Task.findById(comment.taskId);
    if (!task) {
        throw new apiError(404, "Task not found");
    }

    const isCommentAuthor =
        comment.userId.toString() === userId.toString();

    const isBoardOwner =
        task.createdBy.toString() === userId.toString();

    if (!isCommentAuthor && !isBoardOwner) {
        throw new apiError(
            403,
            "You are not allowed to delete this comment"
        );
    }

    await comment.deleteOne();

    return res.status(200).json(
        new apiResponse({}, 200, "Comment deleted successfully")
    );
});

const getComments = asyncHandler(async (req, res) => {

    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
        throw new apiError(404, "Task not found");
    }

    const comments= await Comment.find({ taskId }).populate("userId", "fullName avatar")

    return res.status(200).json(
        new apiResponse(
            comments,
            200,
            "Comments fetched successfully"
        )
    );
});


//////////////////////////////////////////////////////////////////// ATTACHMENTS

const fileUpload=asyncHandler(async(req,res,next)=>{
    const {taskId}=req.params;

    //membership check permissions
    const task=await Task.findById(taskId);
    if(!task){
        throw new apiError(400, "couldnt find the task");
    }

    const list = await List.findById(task.listId);
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

    const user = await User.findById(userId);
    const isAssignee = task.assignees.some(
        id => id.toString() === userId.toString()
    );

    if (!isAssignee) {
        throw new apiError(403, "You are not an assignee of this task");
    }

    if (!req.file) {
        throw new apiError(400, "No file uploaded");
    }
      
    const filePath = req.file.path;      

    const uploadedFile= await uploadOnCloudinary(filePath);

    if(!uploadedFile){
        throw new apiError(500, "Sorry this file has not ben uploadeddd"); 
    }

    const newAttachment= await Attachment.create({
        url: uploadedFile.secure_url,
        public_id: uploadedFile.public_id,
        taskId: taskId,
        name: req.file.originalname,
        uploadedBy: userId
    })

    const activityLog= await ActivityLog.create({
        actionType: "ATTACHMENT_UPLOADED",
        entityType: "ATTACHMENT",
        entityId: task._id,
        performedBy: req.user?._id,
        taskId: task._id,
        message: `A new attachment was uplaoded to this task by ${user.fullName}`
    })

    if(!activityLog){
        throw new apiError(500, "server error in creating an activity log");
    }

    return res.status(201).json(
        new apiResponse( {newAttachment, activityLog},201, "File uploaded successfully")
    );
})

const fileDelete = asyncHandler(async (req, res) => {
    const { fileId } = req.params;

    console.log("DELETE fileId:", fileId);

    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      throw new apiError(400, "Invalid attachment ID");
    }
    
  
    const file = await Attachment.findById(fileId);
    if (!file) {
      throw new apiError(404, "Attachment not found");
    }
  
    const userId = req.user._id;
  
    if (file.uploadedBy.toString() !== userId.toString()) {
      throw new apiError(403, "You are not allowed to delete this attachment");
    }
  
    await Attachment.findByIdAndDelete(fileId);
  
    const activityLog = await ActivityLog.create({
      actionType: "ATTACHMENT_DELETED",
      entityType: "TASK",
      entityId: file.taskId,
      performedBy: userId,
      taskId: file.taskId,
      message: "An attachment was deleted from this task",
    });
  
    return res.status(200).json(
      new apiResponse(activityLog, 200, "File deleted successfully")
    );
});

const getAllFiles = asyncHandler(async (req, res, next) => {
    const { taskId } = req.params;

    if (!taskId) {
        throw new apiError(400, "no taskId found");
    }

    const fileIds = await Attachment.find({ taskId });

    return res.status(200).json(
        new apiResponse(
            fileIds ? fileIds : [],
            200,
            "All file IDs associated with the given task fetched successfully"
        )
    );
});

  
export{
    deleteTask, 
    updateTask, 
    getTasks, 
    createTask, 
    updateTaskStatus, 
    addComment, 
    editComment, 
    deleteComment, 
    getComments,
    fileUpload,
    fileDelete,
    getAllFiles,
    getTaskById
};


