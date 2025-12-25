import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ""
    },
    assignees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
        required: true
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    dueDate: {
        type: Date,
    },
    order: {
        type: Number,
        default: 0
    },
    status:{
        type:String,
        enum: ["todo", "in_progress", "review", "done"],
        default: "todo"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);

