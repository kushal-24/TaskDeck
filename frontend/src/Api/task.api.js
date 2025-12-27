import api from "./axios";

export const createTaskApi=(listId, data)=>{
    return api.post(`/list/${listId}/createtask`, data);
};

export const getTaskApi=(listId)=>{
    return api.get(`/list/${listId}/gettasks`);
}

export const editTaskApi=(data, taskId)=>{
    return api.patch(`/task/${taskId}/updatetask`, data);
}

export const deleteTaskApi=(taskId)=>{
    return api.delete(`/task/${taskId}/deletetask`);
};

export const reorderTaskApi=(listId, data)=>{
    return api.post(`/list/${listId}/task/reorder`, data);
};

export const assignMemberApi=(userId)=>{
    return api.post(`/task/${userId}/assign`)
}

export const unAssignMemberApi=(userId)=>{
    return api.post(`/task/${userId}/unassign`)
}

export const getAllAssigneeApi=(taskId)=>{
    return api.get(`/task/${taskId}/getallassignee`)
}

///////to be done, comments and assigning members


