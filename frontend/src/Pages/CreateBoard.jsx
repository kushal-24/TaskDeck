import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoardApi } from "../Api/board.api";
import LoadingSpinner from "./LoadingSpinner";
import { X } from "lucide-react";

const CreateBoard = ({ setActiveBoard, onCreateBoard }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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
    } catch (err) {
      setError("Failed to create board");
    } finally {
      setLoading(false);
      setActiveBoard(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center"
        onClick={() => setActiveBoard(false)}
      />

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-linear-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl shadow-2xl border border-cyan-500/20 rounded-xl overflow-hidden">
      {loading && (
      <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <LoadingSpinner message="Creating board..." size="md" />
      </div>
    )}
        <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
          <h2 className="text-2xl font-bold text-white">Create Board</h2>
          <button
            onClick={() => setActiveBoard(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
              Board Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-cyan-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              placeholder="Enter board title"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 bg-white/5 border border-cyan-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
              placeholder="Enter board description"
            />
          </div>
        </div>

        <div className="border-t border-cyan-500/20 p-6 bg-linear-to-t from-slate-900/80 to-transparent flex gap-3">
          <button
            onClick={() => setActiveBoard(false)}
            className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-gray-500/30">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !title.trim()}
            className="flex-1 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-2">
            Create
          </button>
        </div>
      </div>
    </>)

};

export default CreateBoard;
