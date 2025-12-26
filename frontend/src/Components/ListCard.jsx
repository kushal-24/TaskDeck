import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
//map toh kardiya container ne...ab rendering and display listCard karega

const ListCard = ({ list, tasks, onAddTask, onDeleteTask, onEditTask, onTaskClick}) => {
  const navigate=useNavigate()

  return (
    <div className="w-72 bg-gray-100 rounded-lg p-3 shadow-sm">
      {/* List Title */}
      <h3 className="text-sm font-semibold mb-3">
        {list.title}
        </h3>

      {/* Tasks */}
      <div className="space-y-2">
        {tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              onClick={()=>onTaskClick(task)}
              key={task._id}
              className="bg-white rounded-md p-3 shadow-sm cursor-pointer hover:bg-gray-50">
             
              {/* Task Title */}
              <p className="text-sm text-gray-800">{task.title}</p>

              {/* Optional meta info */}
              <div className="mt-2 text-xs text-gray-500">
                {/* placeholder for assignee / due date */}
                Task details
              </div>
            </div>
          ))
        ) : 
        (
          <p className="text-xs text-gray-400">No tasks</p>
        )}
      </div>

      {/* Create Task Placeholder */}
      <div 
      onClick={onAddTask}
      className="mt-3 text-sm text-gray-500 cursor-pointer hover:text-gray-700">
        + Add a task
      </div>
    </div>
  );
};

export default ListCard;
