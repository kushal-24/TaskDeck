import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBoardApi } from "../Api/board.api";
import LoadingSpinner from "./LoadingSpinner";
import { X } from "lucide-react";

const CreateBoard = ({ setActiveBoard, onCreateBoard }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [closing, setClosing] = useState(false);

  const navigate = useNavigate();

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setActiveBoard(false), 200);
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    try {
      await createBoardApi({ title, description });
      onCreateBoard();
      navigate("/boards");
    } catch {
      setError("Failed to create board");
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/60 backdrop-blur-md transition-opacity duration-300
        ${closing ? "opacity-0" : "opacity-100"}`}
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden
        rounded-2xl
        bg-[#0a0a0f]/95
        backdrop-blur-2xl
        border border-white/10
        shadow-2xl shadow-cyan-500/10
        transition-all duration-300 transform
        ${closing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}>
        
        {loading && (
          <div className="absolute inset-0 z-[70] bg-[#0a0a0f]/80 backdrop-blur-sm flex items-center justify-center rounded-2xl">
            <LoadingSpinner message="Creating workspace..." size="md" />
          </div>
        )}

        {/* Decorative subtle glows */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-linear-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-sm shadow-lg shadow-cyan-500/20">
              ✨
            </span>
            Create Board
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 space-y-5">
          <div>
            <label className="text-sm font-medium text-gray-300 mb-1.5 block">
              Board Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all placeholder:text-gray-600"
              placeholder="e.g. Q3 Marketing Campaign"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-1.5 block">
              Description <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white resize-none focus:outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all placeholder:text-gray-600"
              placeholder="What is this board for?"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-white/10 p-6 flex gap-3 bg-black/20">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className="flex-1 px-4 py-2.5 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Board
          </button>
        </div>
      </div>
    </div>
  );
  
};

export default CreateBoard;
