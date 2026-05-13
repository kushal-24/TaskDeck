import api from "./axios";

export const getRecentActivityLogsApi = () => {
    return api.get("/activity/recent");
};
