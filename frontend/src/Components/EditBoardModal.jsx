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
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-96 bg-linear-to-br from-slate-900/95 to-slate-800/95
        backdrop-blur-xl shadow-2xl border-l border-cyan-500/20 overflow-y-auto
        transform transition-transform duration-300 ease-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cyan-500/20 sticky top-0 bg-slate-900/80 backdrop-blur">
            <h2 className="text-2xl font-bold text-white">Edit Board</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6  h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                Board Title
              </label>
              <input
                type="text"
                value={boardData.title}
                onChange={(e) => {
                  setBoardData({ ...boardData, title: e.target.value });
                  setChangesMade(true);
                }}
                className="w-full px-4 py-3 bg-white/5 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                Description
              </label>
              <textarea
                rows={5}
                value={boardData.description}
                onChange={(e) => {
                  setBoardData({
                    ...boardData,
                    description: e.target.value,
                  });
                  setChangesMade(true);
                }}
                className="w-full px-4 py-3 bg-white/5 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 resize-none"
              />
            </div>

            {/* Members */}
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3 block">
                Board Members
              </label>

              <div className="space-y-2">
                {boardMembers.map((member) => {
                  const isOwner =
                    board.ownerId._id.toString() === member._id.toString();

                  return (
                    <div
                      key={member._id}
                      className="flex items-center justify-between p-2 bg-white/5 border border-cyan-500/50 rounded-lg"
                    >
                      <span className="text-white font-medium">
                        {member.fullName}
                      </span>

                      {!isOwner ? (
                        <button
                          onClick={() => {
                            onRemoveMember(member._id);
                            setChangesMade(true);
                          }}
                          className="p-2 rounded-lg hover:bg-rose-500/20 text-rose-400"
                        >
                          Remove
                        </button>
                      ) : (
                        <span className="text-yellow-500 font-semibold">
                          Owner
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add member */}
              <div className="flex gap-2 pt-3">
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white/5 border border-cyan-500/50 rounded-lg text-white focus:outline-none"
                >
                  <option value="">Select member</option>
                  {users.map((u) => {
                    const isMember = boardMembers.some(
                      (m) => m._id === u._id
                    );
                    return !isMember ? (
                      <option key={u._id} value={u._id}>
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
                  className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-cyan-500/20 p-6 bg-linear-to-t from-slate-900/80 to-transparent flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 cursor-pointer px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg">
              Cancel
            </button>

            <button
              disabled={!changesMade}
              onClick={saveEdit}
              className="flex-1 cursor-pointer px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBoardModal;
