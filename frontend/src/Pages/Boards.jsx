import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBoardsApi } from "../Api/board.api";
import { Kanban, LogOut } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner.jsx";

import BoardGrid from "../Components/BoardGrid.jsx";
import {getAllUsers } from "../Api/auth.api.js";
import { useAuth } from "../Context/Auth.context.jsx";
import CreateBoard from "./CreateBoard.jsx";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [createBoard, setCreateBoard] = useState(false);
  const [users,setUsers]=useState([])
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (user) {
      const fetchBoardsAndUsers = async () => {
        try {
          setLoading(true)
          const resBoards = await getAllBoardsApi();
          console.log(resBoards.data.data);
          setBoards(resBoards.data.data || []);

          const resUsers= await getAllUsers();
          setUsers(resUsers.data.data);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch boards and users");
        } finally {
          setLoading(false);
          requestAnimationFrame(() => {
            setAnimate(true);
          });
        }
      };
      fetchBoardsAndUsers();
    } 
    else return <p className="text-4xl">Loading..........</p>;
  }, []);

  const onCreateHandler= async()=>{
    const res= await getAllBoardsApi()
    setBoards(res.data.data);
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  const logoutHandler = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
    {loading && (
      <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <LoadingSpinner message="Fetching board..." size="lg" />
      </div>
    )}

    {/* Cyan glow */}
    <div className="fixed -top-40 -left-40 w-125 h-125 bg-cyan-500/10 rounded-full blur-3xl" />
    
    {/* Violet glow */}
    <div className="fixed -bottom-40 -right-40 w-125 h-125 bg-violet-500/10 rounded-full blur-3xl" />
    
        {/*............. Navbar............... */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-4xl"> 
          <nav className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl px-5 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Kanban className="w-8 h-8 text-cyan-400" strokeWidth={2.5} />
                <span className="text-lg hidden sm:block font-bold text-white">TaskDeck</span>
              </div>

              <div className="flex items-center gap-3">
                <button 
                onClick={()=>logoutHandler()}
                className="p-1.5 rounded-xl backdrop-blur-lg flex flex-row gap-2 justify-center items-center text-white cursor-pointer hover:text-cyan-400 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 group">
                  <LogOut className="w-5 h-5 flex text-gray-300 group-hover:text-cyan-400 transition-colors" />
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </div>

        <div className={`pt-24 pb-12 px-6 max-w-7xl mx-auto
        ${animate ? "reveal-up" : "opacity-0 translate-y-6"}`}>
          <div className="mb-8">
            <h1 className={`text-3xl font-bold text-white mb-2 `}>
              Welcome back {user.fullName}
            </h1>
            <p className="text-gray-400 reveal-up">Here's what you've been working on</p>
          </div>

          <div className="m-3 flex justify-end">
            <button 
            onClick={()=>setCreateBoard(true)}
            className="relative cursor-pointer flex items-center gap-2 border border-white/10 rounded-xl px-6 py-3 text-sm font-semibold text-white hover:text-cyan-400  bg-white/5 backdrop-blur-md hover:bg-cyan-400/10 hover:border-cyan-400/60 transition-all duration-300">
              <span className="text-lg leading-none">+</span>
              Create New Board
            </button>
          </div>

          {/* Boards List (UI delegated to components) */}
          <BoardGrid
            animate={animate}
            users={users}
            boards={boards}
            onBoardClick={(boardId) => navigate(`/boards/${boardId}`)}/>

          {createBoard && (
            <CreateBoard
            setActiveBoard={setCreateBoard}
            onCreateBoard={onCreateHandler}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Boards;
