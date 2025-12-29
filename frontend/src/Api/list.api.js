import api from "./axios";

export const createListApi=(boardId, data)=>{
    return api.post(`/board/${boardId}/createlists`, data);
};

export const getListApi=(boardId)=>{
    return api.get(`/board/${boardId}/getlist`);
}

export const editListApi=(data, listId)=>{
    return api.patch(`/list/${listId}/updatelist`, data);
}

export const deleteListApi=(listId)=>{
    return api.delete(`/list/${listId}/deletelist`);
};

export const reorderListsApi=(boardId, orderedIds)=>{
    return api.post(`/board/${boardId}/lists/reorder`, {orderedIds});
};


