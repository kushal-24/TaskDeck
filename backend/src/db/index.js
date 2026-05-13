import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'
import dotenv from "dotenv";
dotenv.config(); // NO PATH, let it auto-detect .env in project root


const connectDB=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    } catch (err) {
        process.exit();
    }
}

export default connectDB