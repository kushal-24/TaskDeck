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
      setPermissionError("Only the task owner can delete this task.");
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
      setPermissionError("Only the comment author can edit this comment.");
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
    user?._id?.toString() === taskData?.createdBy?.toString() ||
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
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 ${
        closing ? "modal-backdrop-out" : "modal-backdrop-in"
      }`}
    >
      <div
        className={`absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-md
          ${closing ? "modal-backdrop-out" : "modal-backdrop-in"}`}
        onClick={handleClose}
      />
      
      {loading && (
        <div className="absolute inset-0 z-50 bg-[#0a0a0f]/50 backdrop-blur-lg flex items-center justify-center">
          <LoadingSpinner message="Fetching task details..." size="lg" />
        </div>
      )}

      <div
        className={`relative w-full max-w-5xl max-h-[90vh] flex flex-col
          bg-[#0d121f]/90 backdrop-blur-2xl rounded-3xl shadow-[0_0_80px_-15px_rgba(6,182,212,0.15)] 
          border border-white/10 overflow-hidden
          ${closing ? "modal-panel-out" : "modal-panel-in"}`}
      >
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-cyan-500/40 via-violet-500/40 to-blue-500/40 opacity-70" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-white to-gray-400 tracking-tight">
              Task Details
            </h2>
            <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
            <span className="hidden sm:inline-flex px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-medium text-gray-400">
              {taskData?.listId?.title || "Board List"}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10">
            
            {/* LEFT COLUMN - Core Info */}
            <div className="space-y-8">
              {!editMode ? (
                <div className="space-y-8">
                  {/* Title & Desc */}
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                      {taskData?.title}
                    </h3>
                    <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 shadow-inner">
                      <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
                        {taskData?.description || <span className="text-gray-600 italic">No description provided.</span>}
                      </p>
                    </div>
                  </div>

                  {/* Badges: Priority & Due Date */}
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-1">Priority</span>
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border uppercase tracking-wider ${priorityStyles[taskData?.priority] || priorityStyles.medium}`}>
                        {taskData?.priority || "Medium"}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest pl-1">Due Date</span>
                      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-cyan-400" />
                        {taskData?.dueDate ? new Date(taskData.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : "No Date"}
                      </div>
                    </div>
                  </div>

                  {/* Assignees */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 pl-1">Assignees</h4>
                    {taskData?.assignees?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {taskData.assignees.map((assignee, idx) => (
                          <div
                            key={assignee._id}
                            className="flex items-center gap-2.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                          >
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ backgroundColor: `hsl(${(idx * 50) % 360}, 70%, 60%)` }}>
                              {assignee?.fullName?.charAt(0)}
                            </div>
                            <span className="text-gray-200 text-sm font-medium pr-1">{assignee.fullName}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic pl-1">Unassigned</p>
                    )}
                  </div>

                  {/* Attachments */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 pl-1">Attachments</h4>
                    <div className="space-y-2">
                      {Array.isArray(files) && files.length === 0 ? (
                        <p className="text-sm text-gray-500 italic pl-1">No attached files</p>
                      ) : (
                        files.map((file) => (
                          <div key={file._id} className="group flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-3 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                                <Paperclip className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-medium text-gray-300 truncate group-hover:text-cyan-300 transition-colors">
                                {file.name}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeleteFile(file._id)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* EDIT MODE */
                <div className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2 block pl-1">Task Title</label>
                    <input
                      type="text"
                      value={taskData.title}
                      onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-cyan-500/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all shadow-inner"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2 block pl-1">Description</label>
                    <textarea
                      value={taskData.description}
                      rows={5}
                      onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-cyan-500/30 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none shadow-inner custom-scrollbar"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2 block pl-1">Priority</label>
                      <select
                        value={taskData.priority}
                        onChange={(e) => setTaskData({ ...taskData, priority: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all appearance-none cursor-pointer"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2 block pl-1">Due Date</label>
                      <input
                        type="date"
                        value={taskData?.dueDate ? new Date(taskData.dueDate).toISOString().split("T")[0] : ""}
                        onChange={(e) => setTaskData({ ...taskData, dueDate: e.target.value })}
                        className="w-full px-4 py-3 bg-[#0a0a0f]/50 border border-cyan-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all cursor-pointer"
                        style={{ colorScheme: 'dark' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2 block pl-1">Manage Assignees</label>
                    <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 rounded-xl border border-white/10 bg-white/5 p-2 shadow-inner">
                      {members.length > 0 ? (
                        members.map((member) => {
                          const isAssignee = taskData.assignees.some((a) => a._id === member._id);
                          return (
                            <div key={member._id} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2.5">
                              <span className="text-sm font-medium text-gray-200">{member.fullName}</span>
                              {!isAssignee ? (
                                <button onClick={() => addAssigneeHandler(member)} className="rounded-md cursor-pointer bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-colors">
                                  Add
                                </button>
                              ) : (
                                <button onClick={() => removeAssigneeHandler(member)} className="rounded-md cursor-pointer bg-rose-500/10 border border-rose-500/30 px-3 py-1 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors">
                                  Remove
                                </button>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-gray-500 text-center py-2">No members available</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2 block pl-1">Upload Attachment</label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="flex-1 px-3 py-2 bg-[#0a0a0f]/50 border border-cyan-500/30 rounded-xl text-sm text-gray-400 file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 transition-all cursor-pointer"
                      />
                      <button
                        onClick={() => handleAttachFile(file)}
                        disabled={!file}
                        className="px-4 py-2 cursor-pointer bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cyan-500 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - Comments */}
            <div className="flex flex-col h-[500px] lg:h-auto border-t lg:border-t-0 lg:border-l border-white/5 pt-8 lg:pt-0 lg:pl-10">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                Comments 
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-gray-400">{taskComments.length}</span>
              </h4>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 rounded-xl">
                {taskComments.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
                    <div className="w-12 h-12 mb-3 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">No comments yet</p>
                    <p className="text-gray-600 text-xs mt-1">Start the conversation below</p>
                  </div>
                ) : (
                  taskComments.map((c) => (
                    <div key={c._id} className="group relative bg-white/[0.03] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.05] transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-cyan-300 text-sm">{c.userId?.fullName}</span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {editingCommentId === c._id ? (
                        <div className="mt-2">
                          <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full bg-[#0a0a0f]/50 border border-cyan-500/30 rounded-lg p-2 text-sm text-gray-200 outline-none resize-none"
                            rows={3}
                          />
                          <div className="flex justify-end gap-2 mt-2">
                            <button onClick={() => setEditingCommentId(null)} className="px-3 py-1 text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
                            <button onClick={() => saveEditComment(content, c._id)} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-md text-xs font-bold hover:bg-cyan-500/30 transition-colors cursor-pointer">Save</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{c.content}</p>
                          <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {c.userId?._id === user?._id && (
                              <button onClick={() => startEditComment(c)} className="p-1.5 rounded-md bg-[#0a0a0f]/80 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer border border-white/5 shadow-sm">
                                <Edit2 className="w-3 h-3" />
                              </button>
                            )}
                            {(c.userId?._id === user?._id || taskData?.createdBy === user?._id) && (
                              <button onClick={() => deleteComment(c._id)} className="p-1.5 rounded-md bg-[#0a0a0f]/80 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer border border-white/5 shadow-sm">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment Input */}
              <div className="mt-4 pt-4 border-t border-white/5 relative">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addComment(comment, taskId); } }}
                  placeholder="Write a comment..."
                  rows={2}
                  className="w-full pl-4 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all resize-none custom-scrollbar shadow-inner"
                />
                <button
                  onClick={() => addComment(comment, taskId)}
                  disabled={!comment.trim()}
                  className="absolute bottom-6 right-3 p-2 bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-white/5 bg-black/20 flex flex-col sm:flex-row gap-3">
          {!editMode ? (
            <>
              {taskEditingAccess && (
                <button
                  onClick={startEditTask}
                  className="flex-1 py-2.5 px-4 cursor-pointer bg-white/5 border border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" /> Edit Task
                </button>
              )}
              <button
                onClick={handleDeleteTask}
                className="flex-1 py-2.5 px-4 cursor-pointer bg-white/5 border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete Task
              </button>
            </>
          ) : (
            <>
              <button
                onClick={saveEditTask}
                className="flex-1 py-2.5 px-4 cursor-pointer bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" /> Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 py-2.5 px-4 cursor-pointer bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Cancel
              </button>
            </>
          )}
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
