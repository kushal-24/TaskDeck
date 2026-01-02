import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import { Task } from "../models/task.model.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { List } from "../models/list.model.js";
import { Board } from "../models/board.model.js";

const assignUser = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const { userId } = req.body;
    const assignerId = req.user._id;
  
    // 1. Task
    const task = await Task.findById(taskId);
    if (!task) throw new apiError(404, "Task not found");
  
    // 2. List
    const list = await List.findById(task.listId);
    if (!list) throw new apiError(404, "List not found");
  
    // 3. Board
    const board = await Board.findById(list.boardId);
    if (!board) throw new apiError(404, "Board not found");
  
    // 4. Assigner must be board member
    const isAssignerBoardMember = board.members.some(
      (id) => id.toString() === assignerId.toString()
    );
    if (!isAssignerBoardMember) {
      throw new apiError(403, "You are not a member of this board");
    }
  
    // 5. Assignee must be board member
    const isUserBoardMember = board.members.some(
      (id) => id.toString() === userId.toString()
    );
    if (!isUserBoardMember) {
      throw new apiError(403, "User is not a member of this board");
    }
  
    // 6. Prevent duplicate assignment
    const alreadyAssigned = task.assignees.some(
      (id) => id.toString() === userId.toString()
    );
    if (alreadyAssigned) {
      throw new apiError(400, "User already assigned to this task");
    }
  
    // 7. Assign
    task.assignees.push(userId);
    await task.save();
  
    // 8. Fetch user only for logging
    const user = await User.findById(userId);
  
    const activityLog = await ActivityLog.create({
      actionType: "USER_ASSIGNED",
      entityType: "TASK",
      entityId: task._id,
      performedBy: assignerId,
      taskId: task._id,
      message: `${user.fullName} was assigned to this task`,
    });
  
    return res.status(200).json(
      new apiResponse(
        { task, activityLog },
        200,
        "User assigned successfully"
      )
    );
  });
const unassignUser=asyncHandler(async(req,res,next)=>{
    const {taskId}=req.params;
    const {userId}= req.body;

    const task = await Task.findById(taskId);
    if(!taskId){
        throw new apiError(400, "no task found");
    }

    const user= await User.findById(userId);
    if(!userId){
        throw new apiError(400, "problem in userId");
    }
    
    if(!task.assignees.includes(userId)){
        throw new apiError(400, "this user was not assigned for the task");
    }

    task.assignees.pull(userId);
    await task.save();

    const activityLog= await ActivityLog.create({
        actionType: "USER_UNASSIGNED",
        entityType: "TASK",
        entityId: task._id,
        performedBy: req.user?._id,
        taskId: task._id,
        message: `An assignee has been removed from this task by the name -${user.fullName}`
    })

    if(!activityLog){
        throw new apiError(500, "server error in creating an activity log");
    }

    return res.status(200).json(
        new apiResponse({task, activityLog},200, "User unassigned successfully")
    );
})
const fetchAllAssignees=asyncHandler(async(req,res,next)=>{
    const {taskId}=req.params;

    const task= await Task.findById(taskId).populate("assignees", "-password -refreshToken");


    if(!task){
        throw new apiError(400, "no task found by id");
    }
    const allAssignees=task.assignees;

    return res
    .json( new apiResponse( 
        allAssignees,
        200,
        "fetched all assignees succsssfully!",
        ))
})

export{fetchAllAssignees, unassignUser,assignUser}