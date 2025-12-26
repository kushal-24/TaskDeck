import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBoardByIdApi } from "../Api/board.api.js";
import { createListApi, deleteListApi, editListApi } from "../Api/list.api.js";
import { createTaskApi, deleteTaskApi, editTaskApi } from "../Api/task.api.js";
import { getListApi } from "../Api/list.api.js";
import { getTaskApi } from "../Api/task.api.js";
import ListContainer from "../Components/ListContainer.jsx";
import CreateList from "../Components/CreateList.jsx";
import TaskDetailModal from "../Components/TaskDetailModal.jsx";

function Board() {
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasksByList, setTasksByList] = useState({});
  const { boardId } = useParams();

  const [activeTask, setActiveTask] = useState(null);

  //fetching the board details
  useEffect(() => {
    const fetchBLT = async () => {
      try {
        //fetch board data
        const resBoard = await getBoardByIdApi(boardId);
        console.log(resBoard.data.data);
        setBoard[resBoard.data.data];
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

  const addList = async (title) => {
    if (!title.trim()) return;
    const res = await createListApi(boardId, { title });
    const createdList = res.data.data;

    setLists((prev) => [...prev, createdList]);
    setTasksByList((prev) => ({ ...prev, [createdList._id]: [] }));
  };

  const editList=async(listId, title)=>{
    const res = await editListApi({title}, listId);
    const editedList = res.data.data;

    setLists((prev) =>
      prev.map((list) =>
        list._id === listId
          ? { ...list, title: editedList.title }
          : list
      )
    );
  }

  const deleteList = async (listId) => {
    await deleteListApi(listId);

    setLists((prev) => prev.filter((item) => item._id !== listId));
    setTasksByList((prev) => {
      const updated = { ...prev };
      delete updated[listId];
      return updated;
    });
  };

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

  const deleteTask = async(taskId, listId) => {
    await deleteTaskApi(taskId);
    setTasksByList((prev) => ({
      ...prev,
      [listId]: prev[listId].filter((task) => task._id !== taskId),
    }));
  };

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

      <hr />

      {/* Lists and Tasks */}
      <h3 className="text-4xl">Lists</h3>
      <ListContainer
        lists={lists}
        tasksByList={tasksByList}
        onTaskClick={setActiveTask} //just to set activeTask
        onCreateTask={addTask}
        onEditList={editList}
        onDeleteList={deleteList}
        //onEditTask={editTask}
      />

      <CreateList boardData={board} onCreateList={addList} />

      {activeTask && (
        <TaskDetailModal
          task={activeTask}//to pass the data of the task as a whole to taskDetailModal
          onClose={() => setActiveTask(null)}
          onDeleteTask={deleteTask}
          onEditTask={editTask}
        />
      )}
    </div>
  );
}

export default Board;
