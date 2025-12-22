// pages/Board.jsx
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import CreateList from "../Components/createList";

const Board = () => {
  const { boardId } = useParams();
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      const res = await axios.get(`/api/v1/lists/${boardId}`, {
        withCredentials: true,
      });
      setLists(res.data.data);
    };

    fetchLists();
  }, [boardId]);

  // 🔥 THIS is the connection
  const createList = async (title) => {
    const res = await axios.post(
      "/api/v1/lists",
      { title, boardId },
      { withCredentials: true }
    );

    // update UI immediately
    setLists((prev) => [...prev, res.data.data]);
  };

  return (
    <div>
      <CreateList onCreate={createList} />

      {lists.map((list) => (
        <div key={list._id}>{list.title}</div>
      ))}
    </div>
  );
};

export default List;
