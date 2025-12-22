import api from "./axios";

export const getAllBoardsApi= ()=>{
    return api.get("/board//getallboards");
};

export const getBoardByIdApi= (boardId)=>{
    return api.get(`/board/${boardId}`);
};

export const createBoardApi= (data)=>{
    return api.post("/board/createboard", data);
};

export const updateBoardApi=(boardId, data)=>{
    return api.patch(`/board/${boardId}/updateboard`, data);
};

export const deleteBoardApi=(boardId)=>{
    return api.delete(`/board/${boardId}`);
};

