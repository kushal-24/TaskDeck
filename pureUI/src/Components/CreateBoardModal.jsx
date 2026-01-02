import React, { useState } from "react";

const CreateBoardModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 z-50 flex items-center justify-center p-4">
      {/* Glassy Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-md "
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">
            Create <span className="text-blue-400">New</span> Board
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Give your project a name and description
          </p>
        </div>

        {/* Form Fields */}
        <form className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Board Title
            </label>
            <input
              type="text"
              placeholder="e.g. Product Sprint"
              className="w-full rounded-lg border border-white/5 bg-white/5 p-3 text-white placeholder-gray-600 outline-none transition focus:border-blue-500/50 focus:bg-white/10"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-500">
              Description (optional)
            </label>
            <textarea
              rows="4"
              placeholder="What is this board for?"
              className="w-full resize-none rounded-lg border border-white/5 bg-white/5 p-3 text-white placeholder-gray-600 outline-none transition focus:border-blue-500/50 focus:bg-white/10"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center justify-end gap-3 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={onClose}
              className=" rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200">
              Cancel
            </button>
            <button
              type="submit"
              className=" rounded-xl px-6 py-2.5 text-sm font-semibold text-cyan-400 border border-cyan-400/30 bg-white/5 backdrop-blur-md hover:bg-cyan-400/10 hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all duration-300">
              Create Board
            </button>
          </div>
        </form>

        {/* Close Icon (Top Right) */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-white"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CreateBoardModal;
