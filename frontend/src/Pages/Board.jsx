import React, { useEffect, useState } from "react";
import {DndContext} from "@dnd-kit/core"
import { useParams } from "react-router-dom";
import {
  deleteBoardApi,
  getBoardByIdApi,
  getboardmembersApi,
  updateBoardApi,
} from "../Api/board.api.js";
import { createListApi, deleteListApi, editListApi, getListApi, reorderListsApi } from "../Api/list.api.js";
import { addCommentApi, createTaskApi, deleteCommentApi, deleteTaskApi, editCommentApi, editTaskApi, getCommentsApi, getTaskApi, reorderTasksApi } from "../Api/task.api.js";
import ListContainer from "../Components/ListContainer.jsx";
import CreateList from "../Components/CreateList.jsx";
import TaskDetailModal from "../Components/TaskDetailModal.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Auth.context.jsx";
import EditBoardModal from "../Components/EditBoardModal.jsx";

function Board() {
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [boardMembers, setBoardMembers] = useState([]);
  const [tasksByList, setTasksByList] = useState({});
  const[comments,setComments]=useState([]);

  const { boardId } = useParams();
  const { user } = useAuth();

  const navigate = useNavigate();

  const [activeTask, setActiveTask] = useState(null);
  const [activeBoard, setActiveBoard] = useState(null);
  
  //fetching the board details////////////////////////////////////////////////////
  useEffect(() => {
    const fetchBLT = async () => {
      try {
        //fetch board data
        const resBoard = await getBoardByIdApi(boardId);
        setBoard(resBoard.data.data);

        //fetch all board members
        const resMembers = await getboardmembersApi(boardId);
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
    };
    fetchBLT();
  }, [boardId]);

  //BOARD operations
  const deleteBoard = async (boardId) => {
    if (board.ownerId !== user._id) return;
    await deleteBoardApi(boardId);
    navigate("/boards", { replace: true });
  };
  const updateBoard= async({ title, description })=>{
    board.title=title;
    board.description=description;

    const resBoard=await updateBoardApi(boardId, board);
    setBoard(resBoard.data.data);
  }

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
    const res = await editTaskApi(editedData, taskId);
    const editedTask = res.data.data;

    setTasksByList((prev) => ({
      ...prev,
      [listId]: prev[listId].map((task) =>
        task._id === taskId
          ? { ...task, ...editedTask } // replace edited task
          : task
      ),
    }));
  };
  const deleteTask = async (taskId, listId) => {
    await deleteTaskApi(taskId);
    setTasksByList((prev) => ({
      ...prev,
      [listId]: prev[listId].filter((task) => task._id !== taskId),
    }));
  };

  //ASSIGNEES...imp/////////////////////////////////////////////////////////////
  const addAssignee = (userId, task) => {
    setTasksByList((prev) => ({
      ...prev,
      [task.listId]: prev[task.listId].map((t) =>
        t._id === task._id
          ? {
              ...t,
              assignees: t.assignees.includes(userId)
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
            assignees: prev.assignees.includes(userId)
              ? prev.assignees
              : [...prev.assignees, userId],
          }
        : prev
    );
  };
  const removeAssignee = (userId, task) => {
    if (task.createdBy === userId)
      return alert("this member cant be removed");
  
    setTasksByList((prev) => ({
      ...prev,
      [task.listId]: prev[task.listId].map((t) =>
        t._id === task._id
          ? {
              ...t,
              assignees: t.assignees.filter(
                (assignee) => assignee !== userId
              ),
            }
          : t
      ),
    }));
  
    setActiveTask((prev) =>
      prev && prev._id === task._id
        ? {
            ...prev,
            assignees: prev.assignees.filter(
              (id) => id !== userId
            ),
          }
        : prev
    );
  };
  
  //COMMENTS SECTION//////////////////////////////////////////////////////////////
  const fetchComments = async (taskId) => {
    const resComments = await getCommentsApi(taskId);
    setComments(resComments.data.data);
  };
  const addComment= async({comment, taskId})=>{
    const resComment= await addCommentApi(taskId, { content: comment });
    const commentData=resComment.data.data.newComment;
    setComments((prev)=>[...prev,commentData]);
  }
  const editComment= async({content, commentId})=>{
    const editedComment= await editCommentApi({content}, commentId);
    const editedCommentData=editedComment.data.data;
    setComments((prev)=>
      prev.map((comment)=> comment._id === commentId ? editedCommentData : comment)
    )
  }
  const deleteComment= async(commentId)=>{
    await deleteCommentApi(commentId);
    setComments((prev)=>prev.filter((comment)=>comment._id !== commentId))
  }

  const handleTaskClick = (task) => {
    setActiveTask(task);
    fetchComments(task._id);
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

  const onDragEndTasks = async(event) => {
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

  const onDragEndLists = async(event)=>{
    const{active, over}= event;

    if(!over) return null;
    if(active.id===over.id) return null;
    
    const oldIndex = lists.findIndex((l) =>l._id === active.id);
    const newIndex = lists.findIndex((l) =>l._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const updatedLists=[...lists];
    const [movedList] = updatedLists.splice(oldIndex, 1);

    updatedLists.splice(newIndex, 0, movedList);

    setLists(updatedLists);

    const orderedIds= updatedLists.map((list)=>list._id);

    try {
      await reorderListsApi(boardId, orderedIds);
    } catch (err) {
      console.error("Failed to reorder lists", err);
      // rollback can be added later
    }
  }
  

  return (
    <div style={{ padding: "16px" }}>
      {/* Board info-- will be present like a navbar on the top*/}
      <h2>Board</h2>
      <p>
        <b>Title:</b> {board?.title}
      </p>
      <p>
        <b>Description:</b> {board?.description}
      </p>

      <button
        onClick={() => deleteBoard(boardId)}
        className="rounded-lg m-3 cursor-pointer bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200">
        Delete board
      </button>

      <button 
      onClick={()=>setActiveBoard(board)}
      className="rounded-lg m-3 cursor-pointer bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200">
        Edit board
      </button>

      <hr />

      {/* Lists and Tasks */}
      <h3 className="text-4xl mt-4">Lists</h3>
      <DndContext
      onDragEnd={onDragEnd}>
      <ListContainer
        lists={lists}
        tasksByList={tasksByList}
        onTaskClick={handleTaskClick} //just to set activeTask
        onCreateTask={addTask}
        onEditList={editList}
        onDeleteList={deleteList}
        onFetchComments={fetchComments}
      />
      </DndContext>

      <CreateList onCreateList={addList} />

      {/* Task Window */}
      {activeTask && (
        <TaskDetailModal
          boardData={board}
          members={boardMembers}
          task={activeTask} //to pass the data of the task as a whole to taskDetailModal
          onClose={() => setActiveTask(null)}
          onTaskClick={handleTaskClick}
          onDeleteTask={deleteTask}
          onEditTask={editTask}
          onAddAssignee={addAssignee}
          onRemoveAssignee={removeAssignee}
          onAddComment={addComment}
          onDeleteComment={deleteComment}
          onEditComment={editComment}
          comments={comments}
          onFetchComments={fetchComments}
        />
      )}

      {/* Edit board details */}
      {activeBoard && (
        <EditBoardModal
          board={activeBoard}
          onUpdateBoard={updateBoard}
          onClose={() => setActiveBoard(null)}
        />
      )}

    </div>
  );
}

export default Board;
