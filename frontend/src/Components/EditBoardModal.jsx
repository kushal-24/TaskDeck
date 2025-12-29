import React, { useState } from "react";

const EditBoardModal = ({board, onClose, onUpdateBoard}) => {
    const[title, setTitle]=useState(board.title);
    const[description,setDescription]=useState(board.description);

    const saveEdit=()=>{
        if(board.title == title && board.description == description) return alert("no changes");
        onUpdateBoard({title,description});
        onClose();
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        
        {/* Modal Box */}
        <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              Edit Board
            </h2>
  
            {/* Close icon (UI only) */}
            <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
  
          {/* Divider */}
          <div className="my-4 h-px bg-gray-200" />
  
          {/* Board Title */}
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Board Title
            </label>
            <input
            value={title}
              type="text"
              onChange={(e)=>setTitle(e.target.value)}
              placeholder="Enter board title"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Board Description */}
          <div className="mb-6">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
            value={description}
              rows="4"
              onChange={(e)=>setDescription(e.target.value)}
              placeholder="Describe your board"
              className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
  
          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button 
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
              Cancel
            </button>
  
            <button 
            onClick={()=>saveEdit()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Save Changes
            </button>
          </div>
  
        </div>
      </div>
    );
  };
  
  export default EditBoardModal;
  