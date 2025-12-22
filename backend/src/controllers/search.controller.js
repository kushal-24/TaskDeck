import { Task } from "../models/task.model.js";
import apiError from "../utils/apiError";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /tasks?search=login&status=todo&page=2
// Backend receives:
// req.query = {
//   search: "login",
//   status: "todo",
//   page: "2"
// }

const filters=asyncHandler(async(req,res,next)=>{
    const {search, status, assignees}=req.query;

    //GET /lists/:listId/tasks?search=login&status=todo

    // pagination defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;


    const {listId}=req.params;
    let query={listId}; //this is my base condition, tasks es list ke andar hi hone chahiye

    if(search){
        query.$or=[
            { title: {$regrex: search, $options: "i"} },
            { description: { $regex: search, $options: "i" } }
        ]
    }
    if(status){
       query.status=status;
    }
    if(assignees){
        query.assignees=assignees
    }
    if(page){

    }
    const tasks= await Task.find(query)
    .skip(skip)
    .limit(limit)

    const totalTasks= await Task.countDocuments(query);//counts collectively number of fdocuments that match the filters

    return res
    .json(
        new apiResponse(
            {
                tasks,
                page,
                limit,
                totalTasks,
                totalPages: Math.ceil(totalTasks / limit) 
            }, 
            200, 
            "Tasks fetched successfully"
        )
    )

})

export {filters}