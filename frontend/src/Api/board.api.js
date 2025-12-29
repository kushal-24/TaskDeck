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
    console.log("API RECEIVED:", boardId, typeof boardId);
    return api.delete(`/board/${boardId}/deleteboard`);
  };

export const addMemberApi=(userId)=>{
    return api.post(`/board/${userId}/addmember`);
}

export const removeMemberApi=(userId)=>{
    return api.post(`/board/${userId}/removemember`);
}

export const getboardmembersApi=(boardId)=>{
    return api.get(`/board/${boardId}/getboardmembers`);
}
