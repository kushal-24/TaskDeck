import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Context/Auth.context";
import UserDropdown from "./UserDropdown";

const TaskDetailModal = ({
  task,
  onClose,
  onDeleteTask,
  onEditTask,
  onAddAssignee,
  onRemoveAssignee,
  members,
}) => {
  if (!task) return null;
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [editable, setEditable] = useState(false);
  const { user } = useAuth();

  const formatName = (name) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  const handleDelete = () => {
    const canDeleteTask = task.createdBy === user._id;

    if (!canDeleteTask) {
      alert("You are not allowed to deleete this task");
      return;
    }
    onDeleteTask(task._id, task.listId);
    onClose();
  };

  const startEdit = () => {
    const canEditTask = task.createdBy === user._id;
    if (!canEditTask) {
      alert("You are not allowed to edit this task");
      return;
    }
    setEditable(true);
  };

  const saveEdit = () => {
    const updatedTask = {
      title,
      description,
      priority,
      dueDate,
    };

    onEditTask(updatedTask, task._id, task.listId);
    setEditable(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          {!editable ? (
            <h2 className="text-lg font-semibold text-gray-800">
              {task.title}
            </h2>
          ) : (
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border px-2 py-1 text-lg font-semibold"
            />
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 px-6 py-5">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Due Date</p>
              {!editable ? (
                <p className="font-medium">{task.dueDate}</p>
              ) : (
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="rounded border px-2 py-1"
                />
              )}
            </div>

            <div>
              <p className="text-gray-500">Priority</p>
              {!editable ? (
                <p className="font-medium">{task.priority}</p>
              ) : (
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="rounded border px-2 py-1"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <p className="mb-1 text-sm font-medium text-gray-700">
              Description
            </p>
            {!editable ? (
              <p className="text-sm text-gray-600">{task.description}</p>
            ) : (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded border px-2 py-1 text-sm"
              />
            )}
          </div>

          {/* Assignees */}
          <div>
            <div className="flex flex-row gap-3">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-300" />
                <div className="h-8 w-8 rounded-full bg-gray-400" />
                <div className="h-8 w-8 rounded-full bg-gray-500" />
              </div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                {task.assignees
                  .map((id) => formatName(members.find((m) => m._id === id)?.fullName))
                  .filter(Boolean)
                  .join(", ")}{" "}
              </p>
              <UserDropdown
                taskData={task}
                members={members}
                onAddAssignee={onAddAssignee}
                onRemoveAssignee={onRemoveAssignee}
              />
            </div>
          </div>

          {/* Attachments */}
          <div>
            <p className="mb-2 text-sm font-medium text-gray-700">
              Attachments
            </p>
            <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
              Drag & drop files or click to upload
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <button
            onClick={handleDelete}
            className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
          >
            Delete Task
          </button>

          {!editable ? (
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              onClick={startEdit}
            >
              Edit Task{" "}
            </button>
          ) : (
            <button
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              onClick={saveEdit}
            >
              update Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
