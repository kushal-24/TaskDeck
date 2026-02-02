import React, { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import { Edit2, Trash2, Users } from "lucide-react";
import LetterAvatar from "../Components/LetterAvatar.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { useParams } from "react-router-dom";
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
  addCommentApi,
  assignMemberApi,
  createTaskApi,
  deleteCommentApi,
  deleteTaskApi,
  getAllAssigneeApi,
  getAllFilesApi,
  getTaskApi,
  reorderTasksApi,
  unAssignMemberApi,
} from "../Api/task.api.js";
import ListContainer from "../Components/ListContainer.jsx";
import TaskDetailModal from "../Components/TaskDetailModal.jsx"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth.context.jsx";
import EditBoardModal from "../Components/EditBoardModal.jsx";
import { getAllUsers } from "../Api/auth.api.js";

function Board() {
  const [users, setUsers] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasksByList, setTasksByList] = useState({});
  const [filesData, setFilesData]=useState([])
  const [permissionError, setPermissionError]=useState(null)

  const [loading, setLoading]= useState(false);
  const [animate, setAnimate]= useState(false);

  const { boardId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTask, setActiveTask] = useState(null);
  const [activeBoard, setActiveBoard] = useState(null);

  //fetching the board details////////////////////////////////////////////////////
  useEffect(() => {
    const fetchBLT = async () => {
      setLoading(true)
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
      }
      finally{
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
    if(!userId===user._id){
      setPermissionError("only permissions for owners")
      return;
    }
    await addMemberApi(board?._id, userId);
    
    const res = await getboardMembersApi(boardId);
    setBoardMembers(res.data.data);
  };

  const removeMember = async (userId) => {    
    if (userId === board?.ownerId){
      alert("boardOwner is always a member only");
      return;
    }
    await removeMemberApi(boardId, userId);

    const res = await getboardMembersApi(boardId);
    setBoardMembers(res.data.data);
  };

  //BOARD operations
  const deleteBoard = async (boardId) => {
    if (board.ownerId._id !== user._id) return alert("sorry, ur not permitted to do this action as ur not the board owner");
    await deleteBoardApi(boardId);
    navigate("/boards", { replace: true });
  };
  const updateBoard = async (boardData) => {
    if (!isOwner) return alert("sorry, ur not permitted to do this action as ur not the board owner");
    await updateBoardApi(boardId, boardData);
    const res= await getBoardByIdApi(boardId);
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
  const addAssignee = async({task, userId}) => {
    const listId= typeof task.listId === "object" ? task.listId._id : task.listId;
   
    setTasksByList((prev) => ({
      ...prev,
      [listId]: prev[listId].map((t) =>
        t._id === task._id
          ? {
              ...t,
              assignees: t.assignees.some((assignee)=>assignee===userId)
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
            assignees: prev.assignees.some((assignee)=>assignee===userId)
              ? prev.assignees
              : [...prev.assignees, userId],
          }
        : prev
    );
  };
  const removeAssignee = async({task, userId}) => {
    const listId= typeof task.listId === "object" ? task.listId._id : task.listId;

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

  const getAllFiles= async(taskId)=>{
    const res= await getAllFilesApi(taskId);
    setFilesData(res.data.data);
    console.log("files  hai saare",res.data.data);
    
  }

  const handleTaskClick = (task) => {
    setActiveTask(task);
    // fetchComments(task._id);
    // getAllFiles(task._id);
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

    /*
    splice(startIndex, count)
    -->removes count elements
    -->starting from startIndex
    -->mutates the array
    -->returns the removed elements as an array
    */
    updatedTasks.splice(newIndex, 0, movedTask);
    /**
     So here:
     -->start at index 0
     -->delete 0 items
     -->insert movedTask
     */

    setTasksByList((prev) => ({
      ...prev,
      [sourceListId]: updatedTasks,
    }));

    const orderedIds = updatedTasks.map((t) => t._id);

    try {
      await reorderTasksApi(sourceListId, orderedIds);
    } catch (err) {
      console.error("Failed to reorder tasks", err);
      // rollback can be added later
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
      // rollback can be added later
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


    <div className="min-h-screen bg-[#0a0e1a]">
    {loading && (
      <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <LoadingSpinner message="Fetching board..." size="lg" />
      </div>
    )}
    
    {/* Cyan glow */}
    <div className="absolute -top-40 -left-40 w-125 h-125 bg-cyan-500/10 rounded-full blur-3xl" />
    
    {/* Violet glow */}
    <div className="absolute -bottom-40 -right-40 w-125 h-125 bg-violet-500/10 rounded-full blur-3xl" />

      {/* ................Navbar........................ */}
      <nav className={`relative overflow-hidden bg-[#0a0e1a]
        ${animate ?"reveal-up" : "opacity-0 translate-y-6"}`}>
      {/* subtle background */}
      <div className="absolute inset-0 bg-linear-to-r from-cyan-500/5 via-transparent to-blue-500/5" />

      <div className="relative border-b border-gray-700/30 bg-linear-to-b from-gray-900/50 to-transparent backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          {/* Top row */}
          <div className="mb-6 flex items-start justify-between gap-8">
            {/* Left */}
            <div className="flex-1 min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <div className="h-1 w-6 rounded-full bg-linear-to-r from-cyan-400 to-blue-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400/70">
                  Board
                </span>
              </div>

              <h1 className="mb-3 text-4xl font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {board?.title}
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-gray-400">
                {board?.description}
              </p>
            </div>

            {/* Right */}
            {isOwner && (
              <div className="flex items-center gap-3 shrink-0">
                {/* Edit */}
                <button className="group cursor-pointer relative overflow-hidden rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-all">
                  <div className="absolute group-hover:from-cyan-400 group-hover:to-blue-500 inset-0 rounded-lg bg-linear-to-r from-cyan-500 to-blue-500" />
                  <div 
                  onClick={()=>setActiveBoard(board)}
                  className="relative flex items-center gap-2">
                    <Edit2 size={16} />
                    Edit
                  </div>
                </button>

                {/* Delete */}
                <button className="group cursor-pointer relative rounded-lg px-5 py-2.5 text-sm font-medium transition-all">
                  <div className="absolute inset-0 rounded-lg border border-red-500/30 bg-red-500/5 group-hover:bg-red-500/15" />
                  <div 
                  onClick={()=>deleteBoard(boardId)}
                  className="relative flex items-center gap-2 text-red-400">
                    <Trash2 size={16} />
                    Delete
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between border-t border-gray-700/20 pt-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg border border-gray-700/30 bg-gray-800/40 p-2">
                <Users size={18} className="text-cyan-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Team Members
                </p>
                <p className="text-sm text-gray-300">
                  {boardMembers?.length} members
                </p>
              </div>
            </div>

            {/* Avatars */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {boardMembers.map((member, index) => (
                  <div
                    key={member._id}
                    className="relative group"
                    style={{ zIndex: boardMembers?.length - index }}>
                    <div className="relative rounded-full border-2 border-[#0a0e1a] transition-transform group-hover:scale-110">
                      <LetterAvatar
                        letter={member.fullName.charAt(0)}
                        color={member.color}
                        size={30}/>
                    </div>

                    {/* Tooltip */}
                    <div className="pointer-events-none absolute bottom-full right-0 mb-3 rounded-lg border border-gray-700/50 bg-gray-800/95 px-2 py-2 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                      {member.fullName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

      {/* Lists and Tasks */}

      {/* Lists Heading */}
      <div className="mx-auto max-w-7xl px-3 pt-6 pb-4">
      <DndContext onDragEnd={onDragEnd}>
        <ListContainer
          ownerId={ownerId}
          animate={animate}
          lists={lists}
          tasksByList={tasksByList}
          onTaskClick={handleTaskClick} //just to set activeTask
          onCreateTask={addTask}
          onEditList={editList}
          onDeleteList={deleteList}
          onCreateList={addList}
        />
      </DndContext>
    </div>

      {/* Task Window */}
      {activeTask && (
        <TaskDetailModal
          ownerId={ownerId}
          members={boardMembers}
          taskId={activeTask} //to pass the data of the task as a whole to taskDetailModal
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
          boardMembers={boardMembers} //change this boardMembers to members only , will be easier
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