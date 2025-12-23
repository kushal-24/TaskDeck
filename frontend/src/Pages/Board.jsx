import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../Api/axios";
import { getBoardByIdApi } from "../Api/board.api.js";
import { getListApi } from "../Api/list.api.js";
import { getTaskApi } from "../Api/task.api.js";

function Board() {
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [tasksByList, setTasksByList] = useState({});
  const { boardId } = useParams();

  //fetching the board details
  useEffect(() => {
    const fetchBLT = async () => {
      try {
        //fetch board data
        const resBoard = await getBoardByIdApi(boardId);
        setBoard(resBoard.data.data);

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

  return (
    <div style={{ padding: "16px" }}>
      {/* Board info */}
      <h2>Board</h2>
      <p>
        <b>Title:</b> {board?.title}
      </p>
      <p>
        <b>Description:</b> {board?.description}
      </p>

      <hr />

      {/* Lists and Tasks */}
      <h3>Lists</h3>

      {lists.map((list) => (
        <div key={list._id} style={{ marginBottom: "16px" }}>
          <h4>List: {list.title}</h4>

          <ul>
            {(tasksByList[list._id] || []).map((task) => (
              <li key={task._id}>{task.title}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default Board;
