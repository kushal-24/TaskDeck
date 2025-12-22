import mongoose, { Schema } from "mongoose"

const activityLogSchema= new Schema({
    actionType:{
        type: String,
        required:true,
        enum: [
            "TASK_CREATED", //done
            "STATUS_CHANGED", //done
            "USER_ASSIGNED", //done
            "USER_UNASSIGNED", //done
            "COMMENT_ADDED", //done
            "ATTACHMENT_UPLOADED", //done
            "ATTACHMENT_DELETED" //done
          ]
    },
    entityType:{
        type:String,
        required:true,
        enum: ["TASK", "COMMENT", "ATTACHMENT"]
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    performedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    taskId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Task",
        required: true
    },
    message:{
        type: String,
    }


},{timestamps:true})

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
