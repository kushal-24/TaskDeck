import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { useAuth } from "../Context/Auth.context";

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
  const [boardData, setBoardData] = useState(board);
  const [isOpen, setIsOpen] = useState(false);

  
  const {user} =useAuth()

  const saveEdit = () => {
    if (
      boardData.title === board.title &&
      boardData.description === board.description
    )
      return alert("no changes");

    // const boardData = {
    //   title: board?.title,
    //   description: board?.description,
    //   members: board?.members,
    // };

    onUpdateBoard(boardData);
    handleClose();
  };

  useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
  }, []);
  
  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 250); // match duration
  };

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}/>
      <div 
      className={`fixed inset-y-0 right-0 z-50 w-96 bg-linear-to-br from-slate-900/95 to-slate-800/95
      backdrop-blur-xl shadow-2xl border-l border-cyan-500/20 overflow-y-auto transform transition-transform duration-300 ease-out
      ${isOpen ? "translate-x-0" : "translate-x-full"}`} >
        
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-cyan-500/20 sticky top-0 bg-slate-900/80 backdrop-blur">
            <h2 className="text-2xl font-bold text-white">Edit Board</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 p-6 space-y-6">
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                Board Title
              </label>
              <input
                type="text"
                value={boardData.title}
                onChange={(e) =>
                  setBoardData({ ...boardData, title: e.target.value })
                }
                className="w-full px-4 py-3 bg-white/5 border border-cyan-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="Enter board title"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                Description
              </label>
              <textarea
                value={boardData.description}
                onChange={(e) =>
                  setBoardData({ ...boardData, description: e.target.value })
                }
                rows={5}
                className="w-full px-4 py-3 bg-white/5 border border-cyan-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                placeholder="Enter board description"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3 block">
                Board Members
              </label>

              <div className="space-y-3">
                {boardMembers.length > 0 ? (
                  <div className="space-y-2">
                    {boardMembers.map((member) => {
                      const isOwner= board?.ownerId._id.toString() === member._id.toString();
                      return (
                        <div
                          key={member._id}
                          className="flex items-center justify-between p-2 bg-white/5 border border-cyan-500/50 rounded-lg hover:bg-white/8 transition-colors">
                          <span className="text-white font-medium">
                            {member.fullName}
                          </span>
                          {!isOwner ? (
                            <button
                              onClick={() =>onRemoveMember(member._id)}
                              className="p-2 rounded-lg hover:bg-rose-500/20 transition-colors text-rose-400 hover:text-rose-300">
                              Remove
                            </button>
                          ):
                          (
                            <button
                              disabled
                              className="p-2 rounded-lg text-yellow-600 font-semibold">
                              Owner
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No members added yet</p>
                )}

                <div className="flex gap-2 pt-2">
                  <select
                    value={selectedMember}
                    onChange={(e) => setSelectedMember(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/5 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all">
                    <option value="">Select a member to add</option>
                    {users.map((u) => {
                      console.log(boardMembers)
                      const isMember= boardMembers.some((m)=> m._id === u._id)
                      return !isMember ? 
                      (
                        <option key={u._id} value={u._id}>
                          {u.fullName}
                        </option>
                      ):
                      null
                    })}
                  </select>
                  <button
                    onClick={()=>onAddMember(selectedMember)}
                    disabled={!selectedMember}
                    className="px-4 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-cyan-500/20 p-6 bg-linear-to-t from-slate-900/80 to-transparent sticky bottom-0 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-gray-500/30">
              Cancel
            </button>
            <button
              onClick={() => saveEdit()}
              className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/30">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditBoardModal;
