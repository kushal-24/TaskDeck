import React, { useState } from "react";
import { useAuth } from "../Context/Auth.context";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

//map toh kardiya container ne...ab rendering and display listCard karega

const SortableTask = ({ task, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
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
        className="cursor-grab text-gray-400 text-xs mb-1 select-none"
      >
        ⠿
      </div>

      {/* Clickable content */}
      {children}
    </div>
  );
};


const ListCard = ({ list, tasks, onAddTask, onEditList, onTaskClick }) => {
  const [editable, setEditable] = useState(false);
  const [title, setTitle] = useState(list.title);
  const { user } = useAuth();

  const startEdit = () => {
    const canEditList = list.createdBy === user._id;

    if (!canEditList) {
      alert("You are not allowed to edit this list");
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

  const canAddTask = list.createdBy === user._id;

  return (
    <div className="w-72 bg-gray-100 rounded-lg p-3 shadow-sm">
      {/* List Title */}

      <div className="mb-3">
        {editable ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
            className="w-full rounded px-2 py-1 text-sm font-semibold outline-none"
            autoFocus
          />
        ) : (
          <h3
            onClick={startEdit}
            className="text-sm font-semibold cursor-pointer"
          >
            {list.title}
          </h3>
        )}
      </div>

      {/* Tasks */}
      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}>
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <SortableTask key={task._id} task={task}>
              <div
                onClick={() => onTaskClick(task)}
                className="bg-white rounded-md p-3 shadow-sm cursor-pointer hover:bg-gray-50"
              >
                <p className="text-sm text-gray-800">{task.title}</p>

                <div className="mt-2 text-xs text-gray-500">Task details</div>
              </div>
            </SortableTask>
          ))
        ) : (
          <p className="text-xs text-gray-400">No tasks</p>
        )}
      </SortableContext>

      {/* Create Task Placeholder */}
      {canAddTask && (
        <div
          onClick={onAddTask}
          className="mt-3 text-sm text-gray-500 cursor-pointer hover:text-gray-700"
        >
          + Add a task
        </div>
      )}
    </div>
  );
};

export default ListCard;
