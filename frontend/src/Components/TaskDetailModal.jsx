import React, { useState } from "react";
import { useAuth } from "../Context/Auth.context";
import UserDropdown from "./UserDropdown";
import { useFileUpload } from "../Hooks/FileUpload";

const TaskDetailModal = ({
  task,
  onClose,
  onDeleteTask,
  onEditTask,
  onAddAssignee,
  onRemoveAssignee,
  members,
  onAddComment,
  onDeleteComment,
  onEditComment,
  comments,
}) => {
  if (!task) return null;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate);
  const [editableTask, setEditableTask] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [content, setContent] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const { upload, remove } = useFileUpload();

  const { user } = useAuth();
  const formatName = (name) =>
    name?.charAt(0).toUpperCase() + name?.slice(1).toLowerCase();

  const handleDeleteTask = () => {
    const canDeleteTask = task.createdBy === user._id;
    if (!canDeleteTask) {
      alert("You are not allowed to delete this task");
      return;
    }
    onDeleteTask(task._id, task.listId);
    onClose();
  };
  const startEditTask = () => {
    const canEditTask = task.createdBy === user._id;
    if (!canEditTask) {
      alert("You are not allowed to edit this task");
      return;
    }
    setEditableTask(true);
  };
  const saveEditTask = () => {
    const updatedTask = { title, description, priority, dueDate };
    onEditTask(updatedTask, task._id, task.listId);
    setEditableTask(false);
    onClose();
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    onAddComment({ comment, taskId: task._id });
    setComment("");
  };
  const startEditComment = (c) => {
    if (c.userId !== user._id) return alert("u cant edit this comment");
    setEditingCommentId(c._id);
    setContent(c.content);
  };

  const saveEditComment = (c) => {
    onEditComment({ content, commentId: c._id });
    setEditingCommentId(null);
    setContent("");
  };

  //attachments///////////
  const handleFileChange = () => {
    setFile(e.target.files[0]);
  };

  const handleAttach = async () => {
    if (!file) return;

    try {
      const uploaded = await upload(task._id, file);

      // store full object, not just url
      setUploadedFile(uploaded);
      setFile(null);
    } catch (err) {
      console.error("File upload failed", err);
    }
  };

  const handleDeleteFile = async () => {
    if (!uploadedFile) return;

    try {
      await remove(uploadedFile._id || uploadedFile.public_id);
      setUploadedFile(null);
    } catch (err) {
      console.error("File delete failed", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />

      {/* Modal */}
      <div className="relative w-full max-w-5xl rounded-xl bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          {!editableTask ? (
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

        {/* BODY */}
        <div className="grid grid-cols-3 gap-6 px-6 py-5 h-[70vh] min-h-0">
          {/* LEFT */}
          <div className="col-span-2 space-y-6 overflow-y-auto pr-2 min-h-0">
            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Due Date</p>
                {!editableTask ? (
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
                {!editableTask ? (
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
              {!editableTask ? (
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
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-300" />
                <div className="h-8 w-8 rounded-full bg-gray-400" />
                <div className="h-8 w-8 rounded-full bg-gray-500" />
              </div>

              <p className="text-sm font-medium text-gray-700">
                {task.assignees
                  .map((id) =>
                    formatName(members.find((m) => m._id === id)?.fullName)
                  )
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <UserDropdown
                taskData={task}
                members={members}
                onAddAssignee={onAddAssignee}
                onRemoveAssignee={onRemoveAssignee}
              />
            </div>

            {/* Attachments */}
            {/* Attachments */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Attachments
              </p>

              {/* Upload box */}
              {!uploadedFile && (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e)=>setFile(e.target.files[0])}
                  />

                  {file && (
                    <button
                      onClick={handleAttach}
                      className="block mx-auto rounded bg-blue-600 px-3 py-1 text-sm text-white">
                      Upload file
                    </button>
                  )}
                </div>
              )}

              {/* Uploaded preview */}
              {uploadedFile && (
                <div className="flex items-center justify-between rounded border p-3">
                  <a
                    href={uploadedFile.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-600 underline"
                  >
                    View attachment
                  </a>

                  <button
                    onClick={handleDeleteFile}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — COMMENTS */}
          <div className="col-span-1 border-l pl-4 flex flex-col min-h-0">
            <p className="mb-3 text-sm font-medium text-gray-700">Comments</p>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-0">
              {comments.map((c) => (
                <div key={c._id} className="rounded-lg border bg-gray-50 p-3">
                  {editingCommentId === c._id ? (
                    <input
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="text-sm text-gray-800 w-full rounded border px-2 py-1"
                    />
                  ) : (
                    <p className="text-sm text-gray-800">{c.content}</p>
                  )}

                  <div className="mt-2 flex gap-3 text-xs text-gray-500">
                    {!editingCommentId ? (
                      <span
                        onClick={() => startEditComment(c)}
                        className="cursor-pointer hover:text-gray-700"
                      >
                        Edit
                      </span>
                    ) : (
                      <span
                        onClick={() => saveEditComment(c)}
                        className="cursor-pointer hover:text-gray-700"
                      >
                        Save changes
                      </span>
                    )}
                    <span
                      onClick={() => onDeleteComment(c._id)}
                      className="cursor-pointer hover:text-red-600"
                    >
                      Delete
                    </span>
                    <span className="font-bold">{c.userId}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div className="mt-3">
              <textarea
                rows="2"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full resize-none rounded border px-3 py-2 text-sm"
              />
              <button
                onClick={handleAddComment}
                className="mt-2 rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t px-6 py-4">
          <button
            onClick={handleDeleteTask}
            className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200"
          >
            Delete Task
          </button>

          {!editableTask ? (
            <button
              onClick={startEditTask}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
            >
              Edit Task
            </button>
          ) : (
            <button
              onClick={saveEditTask}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
            >
              Update Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;
