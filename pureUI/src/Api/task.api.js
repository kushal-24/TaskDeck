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

export const assignMemberApi=(userId)=>{
    return api.post(`/task/${userId}/assign`)
}

export const unAssignMemberApi=(userId)=>{
    return api.post(`/task/${userId}/unassign`)
}

export const getAllAssigneeApi=(taskId)=>{
    return api.get(`/task/${taskId}/getallassignee`)
}

export const addCommentApi=(taskId, comment)=>{
    return api.post(`/task/${taskId}/addcomment`,comment)
}

export const deleteCommentApi=(commentId)=>{
    return api.delete(`/comment/${commentId}/deletecomment`);
}

export const editCommentApi=(content, commentId)=>{
    return api.patch(`/comment/${commentId}/editcomment`,content);
}

export const getCommentsApi=(taskId)=>{
    return api.get(`/task/${taskId}/getcomments`);
}

export const reorderTasksApi=(listId, orderedIds)=>{
    return api.post(`/lists/${listId}/tasks/reorder`, {orderedIds})
}


///////to be done, comments and assigning members


