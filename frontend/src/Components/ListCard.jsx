import React, { useState } from "react";
import { useAuth } from "../Context/Auth.context";
//map toh kardiya container ne...ab rendering and display listCard karega

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
      <div className="space-y-2">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              onClick={() => onTaskClick(task)}
              key={task._id}
              className="bg-white rounded-md p-3 shadow-sm cursor-pointer hover:bg-gray-50"
            >
              {/* Task Title */}
              <p className="text-sm text-gray-800">{task.title}</p>

              {/* Optional meta info */}
              <div className="mt-2 text-xs text-gray-500">
                {/* placeholder for assignee / due date */}
                Task details
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400">No tasks</p>
        )}
      </div>

      {/* Create Task Placeholder */}
      {canAddTask && (<div
        onClick={onAddTask}
        className="mt-3 text-sm text-gray-500 cursor-pointer hover:text-gray-700"> 
      + Add a task
      </div>)}
    </div>
  );
};

export default ListCard;
