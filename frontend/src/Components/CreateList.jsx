import React, { useState } from "react";

const CreateList = ({ onCreateList }) => {
  const [title, setTitle] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateList(title);
    setTitle("");
  };

  return (
    <div className="w-72 mt-3 shrink-0">
      <form
        onSubmit={onSubmitHandler}
        className="
         shrink-0 flex flex-col w-80 max-h-48 bg-linear-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden">
        {/* Header (like List title) */}
        <div className="p-3 min-h-15 border-b border-gray-700/50 bg-black/20">
        <h3 className="text-lg font-semibold text-white">
          Create new list
        </h3>
        </div>

        {/* Input */}
        <input
          type="text"
          value={title}
          placeholder="List title"
          onChange={(e) => setTitle(e.target.value)}
          className="
            rounded-lg
            bg-black/30
            border border-gray-700/50
            px-3 py-2
            m-3
            text-sm text-gray-200
            placeholder-gray-500
            outline-none
            focus:border-cyan-400/60
            focus:ring-1 focus:ring-cyan-400/30
          "
        />

        {/* Action */}
        <button
          type="submit"
          className="
            mt-1
            m-3
            rounded-lg
            bg-cyan-500/10
            border border-cyan-400/30
            py-2
            px-2
            text-sm font-medium text-gray-300
            hover:text-cyan-300
            transition">
          Create List
        </button>
      </form>
    </div>
  );
};

export default CreateList;
