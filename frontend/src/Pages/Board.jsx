import React, { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Edit2, Trash2, Users, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import LetterAvatar from "../Components/LetterAvatar.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { useParams, useNavigate } from "react-router-dom";
import {
  addMemberApi,
  deleteBoardApi,
  getBoardByIdApi,
  getboardMembersApi,
  removeMemberApi,
  updateBoardApi,
} from "../Api/board.api.js";
import {
  createListApi,
  deleteListApi,
  editListApi,
  getListApi,
  reorderListsApi,
} from "../Api/list.api.js";
import {
  createTaskApi,
  getTaskApi,
  reorderTasksApi,
  getAllFilesApi,
} from "../Api/task.api.js";
import ListContainer from "../Components/ListContainer.jsx";
import TaskDetailModal from "../Components/TaskDetailModal.jsx";
import { useAuth } from "../Context/Auth.context.jsx";
import EditBoardModal from "../Components/EditBoardModal.jsx";
import { getAllUsers } from "../Api/auth.api.js";

function Board() {
  const [users, setUsers] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);

  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasksByList, setTasksByList] = useState({});
  const [filesData, setFilesData] = useState([]);
  const [permissionError, setPermissionError] = useState(null);

  const [loading, setLoading] = useState(false);
  const [animate, setAnimate] = useState(false);

  const { boardId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTask, setActiveTask] = useState(null);
  const [activeBoard, setActiveBoard] = useState(null);

  //fetching the board details////////////////////////////////////////////////////
  useEffect(() => {
    const fetchBLT = async () => {
      setLoading(true);
      try {
        //fetch all users
        const users = await getAllUsers();
        setUsers(users.data.data);

        //fetch board data
        const resBoard = await getBoardByIdApi(boardId);
        setBoard(resBoard.data.data);

        //fetch all board members
        const resMembers = await getboardMembersApi(boardId);
        setBoardMembers(resMembers.data.data);

        //fetch list data
        const resLists = await getListApi(boardId);
        const listsData = resLists.data.data;
        setLists(listsData);

        //fetch tasks from listId
        const taskMap = {};
        await Promise.all(
          listsData.map(async (list) => {
            const resTasks = await getTaskApi(list._id);
            taskMap[list._id] = resTasks.data.data;
          })
        );
        setTasksByList(taskMap);
      } catch (error) {
        console.error("Error loading board page", error);
      } finally {
        setLoading(false);
        requestAnimationFrame(() => {
          setAnimate(true);
        });
      }
    };
    fetchBLT();
  }, [boardId]);

  const ownerId = board?.ownerId;
  const isOwner = board?.ownerId._id.toString() === user?._id.toString();

  //MEMBER Operations//////////////////////////////////////////////////////////////
  const addMember = async (userId) => {
    if (!userId === user._id) {
      setPermissionError("only permissions for owners");
      return;
    }
    await addMemberApi(board?._id, userId);

    const res = await getboardMembersApi(boardId);
    setBoardMembers(res.data.data);
  };

  const removeMember = async (userId) => {
    if (userId === board?.ownerId) {
      alert("boardOwner is always a member only");
      return;
    }
    await removeMemberApi(boardId, userId);

    const res = await getboardMembersApi(boardId);
    setBoardMembers(res.data.data);
  };

  //BOARD operations
  const deleteBoard = async (boardId) => {
    if (board.ownerId._id !== user._id)
      return alert(
        "sorry, ur not permitted to do this action as ur not the board owner"
      );
    await deleteBoardApi(boardId);
    navigate("/boards", { replace: true });
  };
  const updateBoard = async (boardData) => {
    if (!isOwner)
      return alert(
        "sorry, ur not permitted to do this action as ur not the board owner"
      );
    await updateBoardApi(boardId, boardData);
    const res = await getBoardByIdApi(boardId);
    setBoard(res.data.data);
  };

  ////LIST operations/////////////////////////////////////////////////////////////
  const addList = async (title) => {
    if (!title.trim()) return;
    const res = await createListApi(boardId, { title });
    const createdList = res.data.data;

    setLists((prev) => [...prev, createdList]);
    setTasksByList((prev) => ({ ...prev, [createdList._id]: [] }));
  };
  const editList = async (listId, title) => {
    const res = await editListApi({ title }, listId);
    const editedList = res.data.data;

    setLists((prev) =>
      prev.map((list) =>
        list._id === listId ? { ...list, title: editedList.title } : list
      )
    );
  };
  const deleteList = async (listId) => {
    await deleteListApi(listId);

    setLists((prev) => prev.filter((item) => item._id !== listId));
    setTasksByList((prev) => {
      const updated = { ...prev };
      delete updated[listId];
      return updated;
    });
  };

  //TASK operations/////////////////////////////////////////////////////////////
  const addTask = async (newTask, listId) => {
    const res = await createTaskApi(listId, newTask);
    const createdTask = res.data.data;

    setTasksByList((prev) => ({
      ...prev,
      [listId]: [...(prev[listId] || []), createdTask],
    }));
  };
  const editTask = async (editedData, taskId, listId) => {
    setTasksByList((prev) => ({
      ...prev,
      [listId]: prev[listId].map((task) =>
        task._id === taskId
          ? { ...task, ...editedData } // replace edited task
          : task
      ),
    }));
  };
  const deleteTask = async (taskId, listId) => {
    setTasksByList((prev) => ({
      ...prev,
      [listId]: prev[listId].filter((task) => task._id !== taskId),
    }));
  };

  //ASSIGNEES...imp/////////////////////////////////////////////////////////////
  const addAssignee = async ({ task, userId }) => {
    const listId =
      typeof task.listId === "object" ? task.listId._id : task.listId;

    setTasksByList((prev) => ({
      ...prev,
      [listId]: prev[listId].map((t) =>
        t._id === task._id
          ? {
              ...t,
              assignees: t.assignees.some((assignee) => assignee === userId)
                ? t.assignees
                : [...t.assignees, userId],
            }
          : t
      ),
    }));

    setActiveTask((prev) =>
      prev && prev._id === task._id
        ? {
            ...prev,
            assignees: prev.assignees.some((assignee) => assignee === userId)
              ? prev.assignees
              : [...prev.assignees, userId],
          }
        : prev
    );
  };
  const removeAssignee = async ({ task, userId }) => {
    const listId =
      typeof task.listId === "object" ? task.listId._id : task.listId;

    setTasksByList((prev) => ({
      ...prev,
      [listId]: prev[listId].map((t) =>
        t._id === task._id
          ? {
              ...t,
              assignees: t.assignees.filter((assignee) => assignee !== userId),
            }
          : t
      ),
    }));

    setActiveTask((prev) =>
      prev && prev._id === task._id
        ? {
            ...prev,
            assignees: prev.assignees.filter((id) => id !== userId),
          }
        : prev
    );
  };

  const getAllFiles = async (taskId) => {
    const res = await getAllFilesApi(taskId);
    setFilesData(res.data.data);
    console.log("files  hai saare", res.data.data);
  };

  const handleTaskClick = (task) => {
    setActiveTask(task);
  };

  //REORDERING//////////////////////////////////////////////////////////////////
  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;

    if (activeType === "TASK") {
      await onDragEndTasks(event);
    }

    if (activeType === "LIST") {
      await onDragEndLists(event);
    }
  };

  const onDragEndTasks = async (event) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    let sourceListId = null;
    let tasks = [];

    for (const [listId, listTasks] of Object.entries(tasksByList)) {
      if (listTasks.some((t) => t._id === active.id)) {
        sourceListId = listId;
        tasks = listTasks;
        break;
      }
    }

    if (!sourceListId) return;

    const oldIndex = tasks.findIndex((t) => t._id === active.id);
    const newIndex = tasks.findIndex((t) => t._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(oldIndex, 1);

    updatedTasks.splice(newIndex, 0, movedTask);

    setTasksByList((prev) => ({
      ...prev,
      [sourceListId]: updatedTasks,
    }));

    const orderedIds = updatedTasks.map((t) => t._id);

    try {
      await reorderTasksApi(sourceListId, orderedIds);
    } catch (err) {
      console.error("Failed to reorder tasks", err);
    }
  };
  const onDragEndLists = async (event) => {
    const { active, over } = event;

    if (!over) return null;
    if (active.id === over.id) return null;

    const oldIndex = lists.findIndex((l) => l._id === active.id);
    const newIndex = lists.findIndex((l) => l._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const updatedLists = [...lists];
    const [movedList] = updatedLists.splice(oldIndex, 1);

    updatedLists.splice(newIndex, 0, movedList);

    setLists(updatedLists);

    const orderedIds = updatedLists.map((list) => list._id);

    try {
      await reorderListsApi(boardId, orderedIds);
    } catch (err) {
      console.error("Failed to reorder lists", err);
    }
  };

  return (
    <>
      <div className="min-h-screen overflow-y-auto overflow-x-hidden bg-[#0a0a0f] relative font-sans text-gray-200">

        {loading && (
          <div className="absolute inset-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl flex items-center justify-center">
            <LoadingSpinner message="Fetching board..." size="lg" />
          </div>
        )}

        {/* Enhanced Background Gradients */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-violet-600/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
        </div>

        {/* ................Navbar........................ */}
        <motion.nav
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-20 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 via-transparent to-blue-500/5 pointer-events-none" />

          <div className="mx-auto w-full px-6 py-4 relative z-10">
            {/* Top row */}
            <div className="mb-4 flex flex-col md:flex-row md:items-start justify-between gap-6">
              {/* Left */}
              <div className="flex-1 min-w-0">
                <div className="mb-2 flex items-center gap-3">
                  <button 
                    onClick={() => navigate('/boards')}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <div className="h-1 w-6 rounded-full bg-linear-to-r from-cyan-400 to-blue-500" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    Workspace Board
                  </span>
                </div>

                <h1 className="mb-2 text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-white via-gray-200 to-gray-500 tracking-tight">
                  {board?.title}
                </h1>

                <p className="max-w-2xl text-sm md:text-base leading-relaxed text-gray-400">
                  {board?.description}
                </p>
              </div>

              {/* Right */}
              {isOwner && (
                <div className="flex items-center gap-3 shrink-0">
                  {/* Edit */}
                  <button 
                    onClick={() => setActiveBoard(board)}
                    className="group relative cursor-pointer overflow-hidden rounded-xl px-4 py-2 text-sm font-medium text-white transition-all border border-cyan-500/30 shadow-lg shadow-cyan-500/10"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-600 to-blue-600 opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-2">
                      <Edit2 size={15} />
                      <span>Edit Details</span>
                    </div>
                  </button>

                  {/* Delete */}
                  <button 
                    onClick={() => {
                      if (window.confirm("Are you sure you want to delete this board?")) {
                        deleteBoard(boardId);
                      }
                    }}
                    className="group relative cursor-pointer overflow-hidden rounded-xl px-4 py-2 text-sm font-medium transition-all bg-white/5 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300"
                  >
                    <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
                    <div className="relative flex items-center gap-2">
                      <Trash2 size={15} />
                      <span>Delete</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-white/5 pt-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-2 shadow-inner">
                  <Users size={16} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Team Overview
                  </p>
                  <p className="text-sm font-medium text-gray-300">
                    {boardMembers?.length} active members
                  </p>
                </div>
              </div>

              {/* Avatars */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-3">
                  {boardMembers.map((member, index) => (
                    <div
                      key={member._id}
                      className="relative group"
                      style={{ zIndex: boardMembers?.length - index }}
                    >
                      <div className="relative rounded-full border-2 border-[#0a0a0f] shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:z-10 group-hover:-translate-y-1">
                        <LetterAvatar
                          letter={member.fullName.charAt(0)}
                          color={member.color || `hsl(${(index * 50) % 360}, 70%, 60%)`}
                          size={32}
                        />
                      </div>

                      {/* Tooltip */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 rounded-lg border border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl shadow-xl px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap">
                        {member.fullName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.nav>

        {/* Lists and Tasks */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative z-10 w-full h-[calc(100vh-200px)] overflow-x-auto overflow-y-hidden pt-6 pb-4 px-6 custom-scrollbar"
        >
          <DndContext onDragEnd={onDragEnd}>
            <ListContainer
              ownerId={ownerId}
              animate={animate}
              lists={lists}
              tasksByList={tasksByList}
              onTaskClick={handleTaskClick}
              onCreateTask={addTask}
              onEditList={editList}
              onDeleteList={deleteList}
              onCreateList={addList}
            />
          </DndContext>
        </motion.div>

        {/* Task Window */}
        {activeTask && (
          <TaskDetailModal
            ownerId={ownerId}
            members={boardMembers}
            taskId={activeTask}
            onClose={() => setActiveTask(null)}
            onTaskClick={handleTaskClick}
            onEditTask={editTask}
            onDeleteTask={deleteTask}
            onAddAssignee={addAssignee}
            onRemoveAssignee={removeAssignee}
            files={filesData}
            onFetchFiles={getAllFiles}
          />
        )}

        {/* Edit board details */}
        {activeBoard && (
          <EditBoardModal
            users={users}
            boardMembers={boardMembers}
            onAddMember={addMember}
            onRemoveMember={removeMember}
            board={activeBoard}
            onUpdateBoard={updateBoard}
            onClose={() => setActiveBoard(null)}
          />
        )}
      </div>
    </>
  );
}

export default Board;
