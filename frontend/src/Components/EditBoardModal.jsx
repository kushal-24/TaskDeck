import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";

const EditBoardModal = ({
  board,
  onClose,
  onUpdateBoard,
  users,
  boardMembers,
  onAddMember,
  onRemoveMember,
}) => {
  const [selectedMember, setSelectedMember] = useState("");
  const [changesMade, setChangesMade] = useState(false);
  const [boardData, setBoardData] = useState(board);
  const [isOpen, setIsOpen] = useState(false);

  // slide-in animation trigger
  useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setChangesMade(false);
      onClose();
    }, 250); // match animation duration
  };

  const saveEdit = () => {
    if (!changesMade) return;

    // Update title/description only if changed
    if (
      boardData.title !== board.title ||
      boardData.description !== board.description
    ) {
      onUpdateBoard(boardData);
    }

    handleClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-[70] w-full max-w-[400px] bg-[#0a0a0f]/95
        backdrop-blur-2xl shadow-[0_0_80px_-15px_rgba(6,182,212,0.15)] border-l border-white/10 overflow-y-auto custom-scrollbar
        transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="min-h-full flex flex-col relative overflow-hidden">
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-white/5 sticky top-0 backdrop-blur-md">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-sm shadow-lg shadow-cyan-500/20">
                ⚙️
              </span>
              Board Settings
            </h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="relative z-10 flex-1 p-6 space-y-8">
            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block pl-1">
                  Board Title
                </label>
                <input
                  type="text"
                  value={boardData.title}
                  onChange={(e) => {
                    setBoardData({ ...boardData, title: e.target.value });
                    setChangesMade(true);
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all placeholder:text-gray-600 shadow-inner"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block pl-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={boardData.description}
                  onChange={(e) => {
                    setBoardData({
                      ...boardData,
                      description: e.target.value,
                    });
                    setChangesMade(true);
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 resize-none transition-all placeholder:text-gray-600 shadow-inner custom-scrollbar"
                />
              </div>
            </div>

            <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

            {/* Members Section */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 block pl-1">
                Manage Members
              </label>

              <div className="space-y-2 mb-4 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                {boardMembers.map((member, idx) => {
                  const isOwner =
                    board.ownerId._id.toString() === member._id.toString();

                  return (
                    <div
                      key={member._id}
                      className="group flex items-center justify-between p-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/5 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ backgroundColor: `hsl(${(idx * 50) % 360}, 70%, 60%)` }}>
                          {member?.fullName?.charAt(0)}
                        </div>
                        <span className="text-gray-200 text-sm font-medium">
                          {member.fullName}
                        </span>
                      </div>

                      {!isOwner ? (
                        <button
                          onClick={() => {
                            onRemoveMember(member._id);
                            setChangesMade(true);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                        >
                          Remove
                        </button>
                      ) : (
                        <span className="px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-[10px] uppercase tracking-wider text-yellow-500 font-bold">
                          Owner
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add member */}
              <div className="flex gap-2">
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-cyan-400/50 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-[#0a0a0f]">Select user to add...</option>
                  {users.map((u) => {
                    const isMember = boardMembers.some(
                      (m) => m._id === u._id
                    );
                    return !isMember ? (
                      <option key={u._id} value={u._id} className="bg-[#0a0a0f]">
                        {u.fullName}
                      </option>
                    ) : null;
                  })}
                </select>

                <button
                  onClick={() => {
                    onAddMember(selectedMember);
                    setSelectedMember("");
                    setChangesMade(true);
                  }}
                  disabled={!selectedMember}
                  className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer flex items-center justify-center"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 border-t border-white/10 p-6 bg-black/20 flex gap-3 mt-auto">
            <button
              onClick={handleClose}
              className="flex-1 cursor-pointer px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-colors">
              Cancel
            </button>

            <button
              disabled={!changesMade}
              onClick={saveEdit}
              className="flex-1 cursor-pointer px-4 py-3 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBoardModal;
