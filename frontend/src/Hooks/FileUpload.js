import api from "../Api/axios";

export const useFileUpload=()=>{
  
  const upload=async(taskId, file)=>{
    const fd=  new FormData();
    fd.append("file", file);

    const res= await api.post(`/task/${taskId}/attachfile`, fd);

    return res.data;
  }

  const remove= async(fileId)=>{
    const res= api.delete(`/task/file/${fileId}/deletefile`)

    return res.data;
  }

  return { upload, remove };
}