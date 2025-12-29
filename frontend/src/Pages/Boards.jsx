/**
 * Boards Page
 * - Fetch all boards
 * - Store boards in state
 * - Render board cards via components
 * - Navigate to create board page
 */

import React, { useEffect, useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import { getAllBoardsApi } from "../Api/board.api";

import BoardGrid from "../Components/BoardGrid.jsx";
import { changeFullName, changePassApi, logoutApi } from "../Api/auth.api.js";
import { useAuth } from "../Context/Auth.context.jsx";
import EditProfileDrawer from "../Components/EditProfileDrawer.jsx";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const{logout}=useAuth()
  const{ user }=useAuth();
  const navigate = useNavigate();
  
  const [activeProfile, setActiveProfile] = useState(null);


  // ✅ Fetch all boards
  useEffect(() => {
    if(user){
      const fetchBoards = async () => {
        try {
          const res = await getAllBoardsApi();
          console.log(res.data.data);
          setBoards(res.data.data || []);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch boards");
        } finally {
          setLoading(false);
        }
      };
  
      fetchBoards();
    }
    else return <p className="text-4xl">Loading..........</p>
  }, []);

  const updateProfile=async({fullName})=>{
    const resEdited= await changeFullName({fullName});

  }

  const savePass = async ({ oldPassword, newPassword }) => {
    await changePassApi({ oldPassword, newPassword });
  };
  

  if (loading) {
    return <div className="p-6">Loading boards...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }


  const logoutHandler=async()=>{
    await logout();
    navigate('/login',{ replace: true });
  }

  return (
    <>
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Boards</h1>

        {/* ➕ Create board button */}
        <button
          onClick={() => navigate("/boards/new")}
          className="rounded-md bg-blue-600 px-4 py-2 text-white cursor-pointer">
          Create New Board
        </button>
        <button
        onClick={()=>setActiveProfile(user)}
          className="rounded-md bg-blue-600 px-4 py-2 text-white cursor-pointer">
          Edit profile
        </button>
        <button
        onClick={logoutHandler}
          className="rounded-md bg-blue-600 px-4 py-2 text-white cursor-pointer">
          logout
        </button>
      </div>

      {/* Boards List (UI delegated to components) */}
      <BoardGrid
        boards={boards}
        onBoardClick={(boardId) => navigate(`/boards/${boardId}`)}
      />
      
      {activeProfile && (
        <EditProfileDrawer
        onUpdateProfile={updateProfile}
        onSavePass={savePass}
        onClose={()=>setActiveProfile(null)}
        profile={user}
        />
      )}
    </div>
  </>
  );
};

export default Boards;
