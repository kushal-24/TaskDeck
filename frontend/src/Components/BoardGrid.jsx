import React from "react";
import { useAuth } from "../Context/Auth.context";

const BoardGrid = ({users, boards, onBoardClick, animate }) => {
  const { user } = useAuth();

  return (
    <div className={`mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 mb-12
    ${animate ? "reveal-up" : "opacity-0 translate-y-6"}`}>
      {boards.map((board) => {
        const isOwner = board.ownerId.toString() === user._id.toString();
        const isMember = board.members.includes(user._id);    
        const userData= users.find((user)=> user._id?.toString() === board.ownerId?.toString())
        return(
          isMember &&(
            <div
          key={board._id}
          onClick={() => onBoardClick(board._id)}
            className="group cursor-pointer backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
            {/* <div className="relative h-36 overflow-hidden">
              <img
                src={board.image}
                alt={board.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/>
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            </div> */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                {board.title}
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-linear-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-medium">
                  {userData?.fullName.charAt(0)}
                </div>
                <span className="text-gray-400 text-s">{userData?.fullName}</span>
              </div>
            </div>
          </div>
          )
        )
      })}
    </div>
  );
};

export default BoardGrid;