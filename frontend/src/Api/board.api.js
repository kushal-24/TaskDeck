import api from "./axios";

export const getAllBoardsApi= ()=>{
    return api.get("/board/getallboards");
};

export const getBoardByIdApi= (boardId)=>{
    return api.get(`/board/${boardId}/viewboard`);
};

export const createBoardApi= (data)=>{
    return api.post("/board/createboard", data);
};

export const updateBoardApi=(boardId, data)=>{
    return api.patch(`/board/${boardId}/updateboard`, data);
};

export const deleteBoardApi = (boardId) => {
    return api.delete(`/board/${boardId}/deleteboard`);
  };

export const addMemberApi=(boardId, userId)=>{
    return api.post(`/board/${boardId}/addmember`, {userId});
}

export const removeMemberApi=(boardId, userId)=>{
    return api.post(`/board/${boardId}/removemember`, {userId});
}

export const getboardMembersApi=(boardId)=>{
    return api.get(`/board/${boardId}/getboardmembers`);
}
