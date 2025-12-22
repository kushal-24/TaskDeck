import mongoose, { Schema } from "mongoose";
import { Task } from "./task.model.js";
import { User } from "./user.model.js";

const commentSchema= new Schema({
    taskId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: Task
    },
    userId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: User
    },
    content: {
        type: String,
        required: true,
    }
},{timestamps: true})

export const Comment= mongoose.model("Comment", commentSchema);