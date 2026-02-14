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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

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
    <div className="fixed inset-0 z-50">
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/60 backdrop-blur-md
          ${closing ? "modal-backdrop-out" : "modal-backdrop-in"}`}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div
          className={`relative w-full max-w-md
            rounded-xl overflow-hidden
            bg-linear-to-br from-slate-900/95 to-slate-800/95
            backdrop-blur-xl
            border border-cyan-500/20
            shadow-2xl
            ${closing ? "modal-panel-out" : "modal-panel-in"}`}>
          {loading && (
            <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <LoadingSpinner message="Creating board..." size="md" />
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
            <h2 className="text-2xl font-bold text-white">Create Board</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                Board Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-white/5 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
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
                className="w-full px-4 py-2.5 bg-white/5 border border-cyan-500/50 rounded-lg text-white resize-none focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                placeholder="Enter board description"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-cyan-500/20 p-6 flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !title.trim()}
              className="flex-1 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 text-white font-semibold rounded-lg"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBoard;
