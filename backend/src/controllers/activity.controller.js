import { ActivityLog } from "../models/activityLog.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import { Task } from "../models/task.model.js";

export const getRecentActivityLogs = asyncHandler(async (req, res, next) => {
    // For dashboard, we could fetch recent global activity logs
    // Or we could fetch logs for tasks related to the user's boards
    // A simple approach is just fetch the latest 15 logs and populate performedBy and taskId
    const logs = await ActivityLog.find({})
        .sort({ createdAt: -1 })
        .limit(15)
        .populate("performedBy", "fullName email")
        .populate("taskId", "title");

    return res
        .status(200)
        .json(new apiResponse(logs, 200, "Activity logs fetched successfully"));
});
