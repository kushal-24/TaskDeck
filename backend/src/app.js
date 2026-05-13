import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import passport from "passport";
import "./config/passport.js";
import googleAuthRoutes from "./routes/googleAuth.routes.js";



const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, //👉 “Allow this frontend to access my backend and allow cookies.”
    credentials: true,
}))

app.use("/auth",googleAuthRoutes)
app.use(passport.initialize());
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit:"16kb"}));
app.use(express.static("public"))
app.use(cookieParser());

import boardRouter from './routes/board.router.js';
import userRouter from './routes/user.router.js';
import listRouter from './routes/list.router.js';
import taskRouter from './routes/task.router.js';
import activityRouter from './routes/activity.router.js';


app.use('/api/v1/user', userRouter);
app.use('/api/v1/board', boardRouter);
app.use('/api/v1',listRouter);
app.use('/api/v1',taskRouter);
app.use('/api/v1/activity', activityRouter);

// Global Error Handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err.errors || []
    });
});

export {app}