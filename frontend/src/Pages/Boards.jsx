/**
 * Boards Page
 * - Fetch all boards
 * - Store boards in state
 * - Render board cards via components
 * - Navigate to create board page
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBoardsApi } from "../Api/board.api";
import { Bell, Kanban, LogOut } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner.jsx";

import BoardGrid from "../Components/BoardGrid.jsx";
import { changeFullName, changePassApi, getAllUsers } from "../Api/auth.api.js";
import { useAuth } from "../Context/Auth.context.jsx";
import EditProfileDrawer from "../Components/EditProfileDrawer.jsx";
import CreateBoard from "./CreateBoard.jsx";

const Boards = () => {
  const activityLogs = [
    {
      id: 1,
      action: "You added a new task to Project Alpha",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Sarah Johnson commented on Marketing Campaign",
      time: "4 hours ago",
    },
    {
      id: 3,
      action: "You completed 3 tasks in Product Design",
      time: "5 hours ago",
    },
    {
      id: 4,
      action: "Michael Chen assigned you to Development Sprint",
      time: "1 day ago",
    },
    {
      id: 5,
      action: "Emma Wilson updated the board description",
      time: "2 days ago",
    },
    {
      id: 6,
      action: "You created a new board: Q1 Planning",
      time: "3 days ago",
    },
  ];

  const [boards, setBoards] = useState([]);
  const [createBoard, setCreateBoard] = useState(false);
  const [users,setUsers]=useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeProfile, setActiveProfile] = useState(null);

  // ✅ Fetch all boards
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
        }
      };
      fetchBoardsAndUsers();
    } 
    else return <p className="text-4xl">Loading..........</p>;
  }, []);

  const updateProfile = async ({ fullName }) => {
    const resEdited = await changeFullName({ fullName });
  };

  const savePass = async ({ oldPassword, newPassword }) => {
    await changePassApi({ oldPassword, newPassword });
  };

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
        {/*............. Navbar............... */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-4xl"> 
          <nav className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl px-5 py-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Kanban className="w-8 h-8 text-cyan-400" strokeWidth={2.5} />
                <span className="text-lg font-bold text-white">TaskDeck</span>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-1.5 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 group">
                  <Bell className="w-5 h-5 text-gray-300 group-hover:text-cyan-400 transition-colors" />
                </button>

                <button 
                onClick={()=>logoutHandler()}
                className="p-1.5 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 group">
                  <LogOut className="w-5 h-5 text-gray-300 group-hover:text-cyan-400 transition-colors" />
                </button>
              </div>
            </div>
          </nav>
        </div>

        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back {user.fullName}
            </h1>
            <p className="text-gray-400">Here's what you've been working on</p>
          </div>

          <div className="m-3 flex justify-end">
            <button 
            onClick={()=>setCreateBoard(true)}
            className="relative flex items-center gap-2 border border-white/10 rounded-xl px-6 py-3 text-sm font-semibold text-cyan-400  bg-white/5 backdrop-blur-md hover:bg-cyan-400/10 hover:border-cyan-400/60 transition-all duration-300">
              <span className="text-lg leading-none">+</span>
              Create New Board
            </button>
          </div>

          {/* Boards List (UI delegated to components) */}
          <BoardGrid
            users={users}
            boards={boards}
            onBoardClick={(boardId) => navigate(`/boards/${boardId}`)}/>

          {/* ActivityLogs */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Activity Log</h2>
              <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {activityLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-200">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0" />
                  <div className="flex-1">
                    <p className="text-gray-200 text-sm mb-1">{log.action}</p>
                    <span className="text-gray-500 text-xs">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeProfile && (
            <EditProfileDrawer
              onUpdateProfile={updateProfile}
              onSavePass={savePass}
              onClose={() => setActiveProfile(null)}
              profile={user}
            />
          )}
          {createBoard && (
            <CreateBoard
            setActiveBoard={setCreateBoard}
            onCreateBoard={onCreateHandler}
            />
          )}
        </div>
      </div>
      {/* <button
        onClick={()=>setActiveProfile(user)}
          className="rounded-md bg-blue-600 px-4 py-2 text-white cursor-pointer">
          Edit profile
        </button>
        <button
        onClick={logoutHandler}
          className="rounded-md bg-blue-600 px-4 py-2 text-white cursor-pointer">
          logout
        </button> */}
    </>
  );
};

export default Boards;
