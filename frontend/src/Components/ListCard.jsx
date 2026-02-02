import React, { useState } from "react";
import PermissionToast from "../Pages/PermissionToast";
import { useAuth } from "../Context/Auth.context";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

//map toh kardiya container ne...ab rendering and display listCard karega

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
        onClick={(e) => e.stopPropagation()} // ⭐ IMPORTANT
        className="cursor-grab text-gray-400 text-xs mb-1 select-none"
      >
        ⠿
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
  onTaskClick,
  ownerId,
}) => {
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(list.title);
  const [permissionError, setPermissionError] = useState(null);
  const { user } = useAuth();

  const listOperationsAccess =
    list.createdBy === user?._id || ownerId === user?._id;

  const startEdit = () => {
    if (!listOperationsAccess) {
      setPermissionError("Only list owners & board owners can edit list titles.");
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
        className={` ${animate ? "reveal-up reveal-delay-${Math.min(index, 4)}" : " opacity-0 translate-y-6 "}
        bg-white/5 p-4 shrink-0 w-80 h-150
        bg-linear-to-br from-gray-800/40 to-gray-900/40
        backdrop-blur-md rounded-xl border border-gray-700/50
        shadow-2xl overflow-hidden`}
      >
        {/* List Title */}
        <div className="p-3 min-h-15 border-b border-gray-700/50 bg-black/20">
          {editable ? (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              className="w-full rounded px-2 py-1 font-semibold text-white outline-none"
              autoFocus
            />
          ) : (
            <h2
              onClick={startEdit}
              className="text-lg font-semibold text-white cursor-pointer"
            >
              {list.title}
            </h2>
          )}
        </div>

        {/* Tasks */}
        <div className="p-4 overflow-y-auto h-[calc(100%-60px)] space-y-3">
          <SortableContext
            items={tasks.map((task) => task._id)}
            strategy={verticalListSortingStrategy}
          >
            {tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <SortableTask key={task._id} task={task}>
                  <div
                    onClick={() => onTaskClick(task._id)}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4
                    border border-gray-700/30 hover:border-cyan-500/50
                    transition-all cursor-pointer"
                  >
                    <p className="text-gray-200 text-sm">{task.title}</p>
                    <div className="mt-2 text-gray-200 text-xs">
                      Task details
                    </div>
                  </div>
                </SortableTask>
              ))
            ) : (
              <p className="text-xs text-gray-400">
                No tasks! Create your first one
              </p>
            )}
          </SortableContext>

          {/* Create Task */}
          {listOperationsAccess && (
            <div
              onClick={onAddTask}
              className="mt-3 text-sm text-white cursor-pointer
              hover:text-cyan-500 transition-all duration-300"
            >
              + Add a task
            </div>
          )}
        </div>
      </div>
    </>
  );
};


export default ListCard;
