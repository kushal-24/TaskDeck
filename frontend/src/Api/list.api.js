import api from "./axios";

export const createListApi=(boardId, data)=>{
    return api.post(`/board/${boardId}/createlists`, data);
};

export const getListApi=(boardId)=>{
    return api.get(`/board/${boardId}/getlist`);
}

export const updateList=(data, listId)=>{
    return api.patch(`/list/${listId}/getlist`, data);
}

export const deleteListApi=(listId)=>{
    return api.delete(`/list/${listId}/deletelist`);
};

export const reorderListApi=(boardId, data)=>{
    return api.post(`/board/${boardId}/lists/reorder`, data);
};


