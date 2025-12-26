import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Api/axios";
import { getBoardByIdApi } from "../Api/board.api.js";
import { createListApi, deleteListApi } from "../Api/list.api.js";
import { createTaskApi } from "../Api/task.api.js";
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

  const deleteTask = (taskId, listId) => {
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
        onTaskClick={setActiveTask}
        onCreateTask={addTask}
        onDeleteTask={deleteTask}
        //onEditTask={editTask}
      />

      <CreateList onCreateList={addList} onDeleteList={deleteList} />

      {activeTask && (
        <TaskDetailModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
        />
      )}
    </div>
  );
}

export default Board;
