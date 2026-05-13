import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBoardsApi } from "../Api/board.api";
import { Kanban, LogOut, Settings, LayoutGrid, Users, Activity, Clock } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "./LoadingSpinner.jsx";

import BoardGrid from "../Components/BoardGrid.jsx";
import {getAllUsers } from "../Api/auth.api.js";
import { useAuth } from "../Context/Auth.context.jsx";
import CreateBoard from "./CreateBoard.jsx";
import UserSettingsModal from "../Components/UserSettingsModal.jsx";
import ActivityLogWidget from "../Components/ActivityLogWidget.jsx";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [createBoard, setCreateBoard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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
    return <div className="p-6 text-red-500 flex justify-center items-center min-h-screen">
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl max-w-md text-center backdrop-blur-md">
        <p className="text-red-400 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors">Try Again</button>
      </div>
    </div>;
  }

  const logoutHandler = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  // Generate current date string
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0f] relative overflow-hidden font-sans">
    {loading && (
      <div className="absolute inset-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center justify-center">
        <LoadingSpinner message="Loading your workspace..." size="lg" />
      </div>
    )}

    {/* Enhanced Background Gradients */}
    <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px]" />
      <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-violet-600/10 rounded-full blur-[120px]" />
      <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
    </div>
    
        {/*............. Navbar............... */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl"> 
          <nav className="backdrop-blur-2xl bg-white/[0.02] border border-white/5 rounded-2xl shadow-2xl px-6 py-3 relative overflow-hidden flex items-center justify-between">
            <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 via-transparent to-violet-500/5 opacity-50" />
            
            <div className="flex items-center gap-3 group cursor-pointer relative z-10">
              <div className="p-2 bg-linear-to-br from-cyan-400/20 to-blue-500/20 rounded-xl border border-cyan-400/20 group-hover:border-cyan-400/40 transition-colors">
                <Kanban className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400 tracking-tight">TaskDeck</span>
            </div>

            {/* Added a subtle clock/date indicator in nav to feel more professional */}
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-400 relative z-10 px-4 py-2 bg-white/5 border border-white/5 rounded-lg">
              <Clock className="w-4 h-4 text-cyan-500/70" />
              {currentDate}
            </div>

            <div className="flex items-center gap-3 relative z-10">
              <button 
              onClick={()=>setShowSettings(true)}
              className="p-2 px-4 rounded-xl backdrop-blur-lg flex items-center gap-2 text-sm font-medium text-gray-300 cursor-pointer hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:block">Settings</span>
              </button>

              <button 
              onClick={()=>logoutHandler()}
              className="p-2 px-4 rounded-xl backdrop-blur-lg flex items-center gap-2 text-sm font-medium text-gray-300 cursor-pointer hover:text-red-400 bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/30 transition-all duration-300">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Logout</span>
              </button>
            </div>
          </nav>
        </motion.div>

        <main className={`relative z-10 pt-32 pb-20 px-6 max-w-5xl mx-auto transition-all duration-700
        ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wider uppercase mb-4"
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Workspace Overview
              </motion.div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white via-gray-200 to-gray-500 mb-3 tracking-tight">
                Welcome back, {user?.fullName?.split(' ')[0] || 'User'}
              </h1>
              <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
                Here's an overview of your active projects and recent updates across your boards.
              </p>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={()=>setCreateBoard(true)}
              className="group relative cursor-pointer inline-flex items-center gap-3 rounded-xl px-6 py-3.5 font-semibold text-white bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <div className="relative z-10 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-lg leading-none">+</span>
                Create Board
              </div>
            </motion.button>
          </div>

          {/* Stats Overview */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
          >
            {/* Stat Card 1 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-sm hover:bg-white/[0.04] transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                <Kanban className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium mb-0.5">Active Boards</p>
                <p className="text-2xl font-bold text-white leading-none">{boards.length}</p>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-sm hover:bg-white/[0.04] transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium mb-0.5">Team Members</p>
                <p className="text-2xl font-bold text-white leading-none">{users.length}</p>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex items-center gap-4 backdrop-blur-sm hover:bg-white/[0.04] transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform duration-300">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium mb-0.5">System Status</p>
                <p className="text-2xl font-bold text-white leading-none flex items-center gap-2">
                  Online
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-1"></span>
                </p>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-white">Your Boards</h2>
            <div className="h-px flex-1 bg-linear-to-r from-white/10 to-transparent"></div>
          </div>

          {/* Boards List */}
          <div className="mb-12">
            <BoardGrid
              animate={animate}
              users={users}
              boards={boards}
              onBoardClick={(boardId) => navigate(`/boards/${boardId}`)}/>
          </div>

          {/* Activity Logs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ActivityLogWidget />
          </motion.div>
          
        </main>

        {createBoard && (
            <CreateBoard
            setActiveBoard={setCreateBoard}
            onCreateBoard={onCreateHandler}
            />
          )}

        {showSettings && (
            <UserSettingsModal onClose={() => setShowSettings(false)} />
        )}
      </div>
    </>
  );
};

export default Boards;
