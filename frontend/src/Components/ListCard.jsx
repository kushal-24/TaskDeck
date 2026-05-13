import React, { useState } from "react";
import PermissionToast from "../Pages/PermissionToast";
import { useAuth } from "../Context/Auth.context";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Trash2, Edit2, MoreVertical } from "lucide-react";

const SortableTask = ({ task, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task._id,
    data: { type: "TASK" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {/* Drag handle ONLY */}
      <div
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="cursor-grab text-gray-500 hover:text-gray-300 text-xs mb-1 select-none flex justify-center w-full"
      >
        <div className="w-8 h-1 rounded-full bg-gray-600/50" />
      </div>
      {/* Clickable content */}
      {children}
    </div>
  );
};


const ListCard = ({
  animate,
  index,
  list,
  tasks,
  onAddTask,
  onEditList,
  onDeleteList,
  onTaskClick,
  ownerId,
}) => {
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [permissionError, setPermissionError] = useState(null);
  const { user } = useAuth();

  const isListOwner = list.createdBy === user?._id;
  const isBoardMemberOrOwner = true; // Board.jsx already restricts view to members/owners

  const startEdit = () => {
    if (!isListOwner) {
      setPermissionError("Only the list owner can edit or delete this list.");
      return;
    }
    setEditable(true);
  };

  const saveEdit = () => {
    if (title.trim() && title !== list.title) {
      onEditList(list._id, title);
    }
    setEditable(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this list?")) {
      onDeleteList(list._id);
    }
  };

  return (
    <>
      {/* Permission Toast */}
      {permissionError && (
        <PermissionToast
          message={permissionError}
          onClose={() => setPermissionError(null)}
        />
      )}

      <div
        className={` ${animate ? "reveal-up" : " opacity-0 translate-y-6 "}
        flex flex-col shrink-0 w-[320px] max-h-[75vh]
        bg-[#0a0e1a]/80 backdrop-blur-2xl rounded-2xl border border-white/10
        shadow-2xl shadow-cyan-500/5 overflow-hidden transition-all duration-300`}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-cyan-500/50 to-blue-500/50 opacity-50" />
        
        {/* List Title Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between group relative bg-white/[0.02]">
          {editable ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              className="w-full rounded-lg px-3 py-1.5 font-semibold text-white bg-white/10 border border-cyan-500/50 outline-none focus:ring-1 focus:ring-cyan-500/50"
              autoFocus
            />
          ) : (
            <h2
              onClick={startEdit}
              className="text-base font-bold text-gray-200 cursor-pointer hover:text-white transition-colors truncate pr-2 flex-1"
            >
              {list.title}
            </h2>
          )}

          {/* List Actions */}
          {isListOwner && !editable && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={startEdit}
                className="p-1.5 rounded-md hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Edit2 size={14} />
              </button>
              <button 
                onClick={handleDelete}
                className="p-1.5 rounded-md hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Tasks Container */}
        <div className="p-3 overflow-y-auto flex-1 space-y-3 custom-scrollbar">
          <SortableContext
            items={tasks.map((task) => task._id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <SortableTask key={task._id} task={task}>
                  <div
                    onClick={() => onTaskClick(task._id)}
                    className="bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-3.5
                    border border-white/5 hover:border-cyan-500/30
                    shadow-sm hover:shadow-cyan-500/10
                    transition-all duration-200 cursor-pointer group"
                  >
                    <p className="text-gray-200 text-sm font-medium leading-snug group-hover:text-white transition-colors">
                      {task.title}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/5 text-gray-400">
                        Details
                      </span>
                    </div>
                  </div>
                </SortableTask>
              ))
            ) : (
              <div className="text-center py-6 px-4 border border-dashed border-white/10 rounded-xl bg-white/5">
                <p className="text-xs font-medium text-gray-500">
                  No tasks yet
                </p>
              </div>
            )}
          </SortableContext>
        </div>

        {/* Create Task Footer */}
        {isBoardMemberOrOwner && (
          <div className="p-3 border-t border-white/5 bg-white/[0.02]">
            <button
              onClick={onAddTask}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
            >
              <span className="text-lg leading-none">+</span> Add Task
            </button>
          </div>
        )}
      </div>
    </>
  );
};


export default ListCard;
