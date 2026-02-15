import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/Auth.context";
import { useFileUpload } from "../Hooks/FileUpload";
import LoadingSpinner from "../Pages/LoadingSpinner";
import PermissionToast from "../Pages/PermissionToast.jsx"
import {
  X,
  Calendar,
  Paperclip,
  Edit2,
  Trash2,
  Send,
  Check,

} from "lucide-react";
import {
  addCommentApi,
  assignMemberApi,
  deleteCommentApi,
  deleteTaskApi,
  editCommentApi,
  editTaskApi,
  getAllFilesApi,
  getCommentsApi,
  getTaskByIdApi,
  unAssignMemberApi,
} from "../Api/task.api";

const TaskDetailModal = ({
  taskId,
  ownerId,
  onClose,
  onDeleteTask,
  onEditTask,
  onAddAssignee,
  onRemoveAssignee,
  members,
  onFetchFiles,
}) => {
  const [taskData, setTaskData] = useState(null);
  const [taskComments, setTaskComments] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFullTaskContents = async () => {
      try {
        setLoading(true);
        //task
        const resTask = await getTaskByIdApi(taskId);
        setTaskData(resTask.data.data); // populated task with assignees and their names

        //comments
        const resComments = await getCommentsApi(taskId);
        setTaskComments(resComments.data.data);

        //files
        const resFiles = await getAllFilesApi(taskId);
        setFiles(resFiles.data.data);

        console.log("members hai ye: ", members);
        console.log("assignees hai ye: ", resTask.data.data.assignees);
        console.log("these are all the files:", resFiles.data.data);
      } catch (err) {
        console.error("Failed to fetch task or comments or files ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFullTaskContents();
  }, [taskId]);

  const [editMode, setEditMode] = useState(false);
  const [permissionError, setPermissionError] = useState(null);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [content, setContent] = useState(""); //editing content
  const [comment, setComment] = useState("");

  const [file, setFile] = useState(null);
  const { upload, remove } = useFileUpload();

  const { user } = useAuth();

  const handleDeleteTask = async () => {
    const canDeleteTask = taskData.createdBy === user._id;
    if (!canDeleteTask) {
      setPermissionError("Only task owners & assignees can delete tasks.");
      return;
    }
    await deleteTaskApi(taskData._id);
    onDeleteTask(taskData._id, taskData.listId);
    onClose();
  };
  const startEditTask = () => {
    setEditMode(true);
  };
  const saveEditTask = async () => {
    const payload = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
    };

    await editTaskApi(payload, taskData._id);

    const resTask = await getTaskByIdApi(taskData._id);
    setTaskData(resTask.data.data);
    onEditTask(resTask.data.data, taskData._id, taskData.listId._id);
    setEditMode(false);
  };

  //Comments
  const addComment = async (comment, taskId) => {
    if (!comment.trim()) return;

    await addCommentApi(taskId, { content: comment });
    const resComments = await getCommentsApi(taskData._id);
    setTaskComments(resComments.data.data);
    setComment("");
  };
  const editComment = async (content, commentId) => {
    const res = await editCommentApi({ content }, commentId);
    const editedComment = res.data.data;
    setTaskComments((prev) =>
      prev.map((c) => (c._id === commentId ? { ...c, content } : c))
    );
  };
  const deleteComment = async (commentId) => {
    await deleteCommentApi(commentId);
    setTaskComments((prev) =>
      prev.filter((comment) => comment._id !== commentId)
    );
  };
  const startEditComment = (c) => {
    if (c.userId._id !== user?._id) {
      setPermissionError("Only task owners & assignees can delete tasks.");
      return;
    }
    setEditingCommentId(c._id);
    setContent(c.content);
  };
  const saveEditComment = (content, commentId) => {
    editComment(content, commentId);
    setEditingCommentId(null);
    setContent("");
  };

  //attachments///////////
  const handleAttachFile = async (file) => {
    if (!file) return;

    try {
      await upload(taskData._id, file);
      setFiles((prev) => [...prev, file]);
      await onFetchFiles(taskData._id);
      setFile(null);
    } catch (err) {
      console.error("File upload failed", err);
    }
  };
  const handleDeleteFile = async (fileId) => {
    try {
      await remove(fileId);
      setFiles((prev) => prev.filter((file) => file._id !== fileId));
    } catch (err) {
      console.error("File delete failed", err);
    }
  };

  const addAssigneeHandler = async (member) => {
    setTaskData((prev) => ({
      ...prev,
      assignees: [...prev.assignees, member],
    }));

    await assignMemberApi(taskData._id, member._id);
    onAddAssignee({ task: taskData, userId: member._id });
  };

  const removeAssigneeHandler = async (member) => {
    setTaskData((prev) => ({
      ...prev,
      assignees: prev.assignees.filter((a) => a._id !== member._id),
    }));

    await unAssignMemberApi(taskData._id, member._id);
    onRemoveAssignee({ task: taskData, userId: member._id });
  };

  const [closing, setClosing] = useState(false);
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 200); // match animation duration
  };

  const priorityStyles = {
    low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    high: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  };

  const taskEditingAccess =
    user?._id?.toString() === ownerId?.toString() ||
    taskData?.assignees?.some(
      (a) => a._id?.toString() === user?._id?.toString()
    );

    {/* Permission Toast */}
    {permissionError && (
      <PermissionToast
        message={permissionError}
        onClose={() => setPermissionError(null)}
      />
    )}

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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        closing ? "modal-backdrop-out" : "modal-backdrop-in"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-md
          ${closing ? "modal-backdrop-out" : "modal-backdrop-in"}`}
        onClick={handleClose}
      />
      {loading && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <LoadingSpinner message="Fetching task..." size="md" />
        </div>
      )}

      <div
        className={`relative w-full max-w-6xl max-h-[90vh]
          bg-linear-to-br from-slate-900/95 to-slate-800/95
          backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/20 overflow-hidden
          ${closing ? "modal-panel-out" : "modal-panel-in"}`}
      >
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
            <h2 className="text-2xl font-bold text-white">Task Details</h2>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg cursor-pointer hover:bg-white/10 transition-colors text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                {!editMode ? (
                  <>
                    {/* title*/}
                    <div>
                      <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                        Task Name
                      </label>
                      <h3 className="mt-2 text-xl font-semibold text-white">
                        {taskData?.title}
                      </h3>
                    </div>

                    {/* description*/}
                    <div>
                      <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                        Description
                      </label>
                      <p className="mt-2 text-gray-300 leading-relaxed">
                        {taskData?.description}
                      </p>
                    </div>

                    {/* priority*/}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          Priority
                        </label>
                        <div className="mt-2">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                              priorityStyles[taskData?.priority]
                            }`}
                          >
                            {taskData?.priority.charAt(0).toUpperCase() +
                              taskData?.priority.slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Due date*/}
                      <div>
                        <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                          Due Date
                        </label>
                        <div className="mt-2 flex items-center gap-2 text-gray-300">
                          <Calendar className="w-4 h-4 text-cyan-400" />
                          <span>
                            {new Date(taskData?.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Assigneeee*/}
                    <div>
                      <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                        Assignees
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {taskData?.assignees.map((assignee) => (
                          <div
                            key={assignee._id}
                            className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold`}
                            >
                              {assignee?.fullName?.charAt(0)}
                            </div>
                            <span className="text-gray-300 text-sm">
                              {assignee.fullName}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Attachments*/}
                    <div>
                      <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                        Attachments
                      </label>
                      <div className="space-y-2">
                        {Array.isArray(files) && files.length === 0 && (
                          <p className="text-gray-400 text-sm">
                            No attachments
                          </p>
                        )}

                        {Array.isArray(files) &&
                          files.map((file) => (
                            <div
                              key={file._id}
                              className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2"
                            >
                              <span className="text-sm text-gray-200">
                                {file.name}
                              </span>
                              <button
                                onClick={() => handleDeleteFile(file._id)}
                                className="text-red-400 cursor-pointer hover:text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  /*................................. this is the editable Part ........................... */
                  <>
                    <div>
                      <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                        Task Name
                      </label>
                      <input
                        type="text"
                        value={taskData.title}
                        onChange={(e) =>
                          setTaskData({ ...taskData, title: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-cyan-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                        Description
                      </label>
                      <textarea
                        value={taskData.description}
                        onChange={(e) =>
                          setTaskData({
                            ...taskData,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-cyan-500/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                          Priority
                        </label>
                        <select
                          value={taskData.priority}
                          onChange={(e) =>
                            setTaskData({
                              ...taskData,
                              priority: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={
                            taskData?.dueDate
                              ? new Date(taskData.dueDate)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                          onChange={(e) =>
                            setTaskData({
                              ...taskData,
                              dueDate: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-white/5 border border-cyan-500/50 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                        Assignees
                      </label>

                      <div className="space-y-2 rounded-lg border border-cyan-500/50 bg-white/5 p-3">
                        {members.length > 0 ? (
                          members.map((member) => {
                            const isAssignee = taskData.assignees.some(
                              (assignee) => assignee._id === member._id
                            );
                            return (
                              <div
                                key={member._id}
                                className="flex items-center justify-between rounded-md bg-white/5 px-3 py-2"
                              >
                                {/* Assignee name */}
                                <span className="text-sm text-white">
                                  {member.fullName}
                                </span>

                                {/* Action buttons */}
                                <div className="flex gap-2">
                                  {!isAssignee && (
                                    <button
                                      type="button"
                                      onClick={() => addAssigneeHandler(member)}
                                      className="rounded-md cursor-pointer bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/30 transition"
                                    >
                                      Add
                                    </button>
                                  )}

                                  {isAssignee && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        removeAssigneeHandler(member)
                                      }
                                      className="rounded-md cursor-pointer bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-500/30 transition"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-gray-400">
                            No assignees added
                          </p>
                        )}
                      </div>

                      <p className="text-gray-400 text-xs mt-1">
                        Manage task assignees individually
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2 block">
                        Attachments
                      </label>
                      <div className="space-y-2">
                        {files.map((file) => (
                          <div
                            key={file._id}
                            className="flex items-center justify-between gap-3 p-3 bg-white/5 border border-cyan-500/50 rounded-lg hover:bg-white/8 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Paperclip className="w-4 h-4 text-cyan-400 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-300 text-sm truncate">
                                  {file.name}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => null}
                              className="p-2 rounded-lg cursor-pointer hover:bg-rose-500/20 transition-colors text-rose-400 hover:text-rose-300 shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        placeholder="..."
                        className="mt-2 w-full px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 rounded-lg text-cyan-400 hover:text-cyan-300 font-medium transition-colors flex items-center justify-center gap-2"
                      />
                      <button
                        onClick={() => handleAttachFile(file)}
                        disabled={!file}
                        className="flex-1 px-2 py-2 mt-2 cursor-pointer bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg"
                      >
                        Upload file
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col h-full">
                <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-3">
                  Comments
                </label>
                <div className="flex-1 space-y-3 overflow-y-auto max-h-125 pr-2 custom-scrollbar">
                  {taskComments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                      <p className="text-sm">No comments yet</p>
                      <p className="text-xs mt-1">Be the first to add one 👇</p>
                    </div>
                  ) : (
                    taskComments.map((c) => (
                      <div
                        key={c._id}
                        className="p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/8 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {/*comment avatar and everything */}
                          {/* <div
                          className={`w-10 h-10 ${comment.color} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}>
                          {comment.avatar}
                        </div> */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="font-semibold text-white text-sm">
                                {c.userId?.fullName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(c.createdAt).toLocaleString()}
                              </span>
                            </div>

                            {editingCommentId === c._id ? (
                              <>
                                <input
                                  value={content}
                                  onChange={(e) => setContent(e.target.value)}
                                  className="text-gray-300 text-sm leading-relaxed outline-none"
                                />
                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={() =>
                                      saveEditComment(content, c._id)
                                    }
                                    className="flex items-center cursor-pointer gap-1 px-2 py-1 text-xs text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors"
                                  >
                                    <Check className="w-4 h-4" />
                                    Save
                                  </button>
                                  <button
                                    onClick={() => deleteComment(c._id)}
                                    className="flex items-center cursor-pointer gap-1 px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                  {c.content}
                                </p>
                                <div className="flex gap-2 mt-3">
                                  <button
                                    onClick={() => startEditComment(c)}
                                    className="flex items-center gap-1 px-2 py-1 cursor-pointer text-xs text-cyan-400 hover:bg-cyan-500/10 rounded transition-colors"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteComment(c._id)}
                                    className="flex items-center cursor-pointer gap-1 px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Delete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      value={comment}
                      type="text"
                      placeholder="Add a comment..."
                      onChange={(e) => setComment(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                    <button
                      onClick={() => addComment(comment, taskId)}
                      className="px-4 py-2 bg-cyan-600 cursor-pointer hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 p-6 border-t border-cyan-500/20 bg-linear-to-r from-slate-900/50 to-slate-800/50">
            {!editMode ? (
              <>
                {taskEditingAccess && (
                  <button
                    onClick={() => startEditTask()}
                    className="flex-1 sm:px-6 sm:py-3 px-2 py-1.5 cursor-pointer bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit Task
                  </button>
                )}
                <button
                  onClick={() => handleDeleteTask()}
                  className="flex-1 sm:px-6 sm:py-3 px-2 py-1.5 bg-rose-600 cursor-pointer hover:bg-rose-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-rose-500/30 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Task
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => saveEditTask()}
                  className="flex-1 px-6 py-3 bg-cyan-600 cursor-pointer hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/30 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                  }}
                  className="flex-1 px-6 py-3 bg-gray-600 cursor-pointer hover:bg-gray-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-gray-500/30 flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(6, 182, 212, 0.5);
        }
      `}</style>
    </div>
    </>
  );
};

export default TaskDetailModal;
