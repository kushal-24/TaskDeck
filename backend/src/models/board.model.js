import mongoose, { Schema } from "mongoose"

const boardSchema= new Schema({
    title:{
        type: String,
        required:true,
    },
    description:{
        type: String,
        required: true,
    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    members: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
  
},{timestamps:true})

export const Board= mongoose.model('Board',boardSchema);