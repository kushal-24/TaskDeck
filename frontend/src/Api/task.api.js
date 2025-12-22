import api from "./axios";

export const createTaskApi=(listId, data)=>{
    return api.post(`/list/${listId}/createtask`, data);
};

export const getTaskApi=(listId)=>{
    return api.get(`/list/${listId}/gettask`);
}

export const updateTask=(data, taskId)=>{
    return api.patch(`/task/${taskId}/updatetask`, data);
}

export const deleteTaskApi=(taskId)=>{
    return api.delete(`/task/${taskId}/deleteTask`);
};

export const reorderTaskApi=(listId, data)=>{
    return api.post(`/list/${listId}/task/reorder`, data);
};

///////to be done, comments and assigning members


