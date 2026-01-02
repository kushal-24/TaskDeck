import mongoose, { Mongoose, Schema } from "mongoose";

const attachmentSchema= new Schema({
    url:{
        type: String,
    },
    public_id:{
        type: String,
    },
    name:{
        type: String,
        required: true,
    },
    taskId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
    },
    uploadedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
},{timestamps:true})

export const Attachment= mongoose.model("Attachment", attachmentSchema)