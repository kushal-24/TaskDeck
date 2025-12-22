import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ListContainer from '../Components/ListContainer';

function Board() {
  const { boardId } = useParams();

  const [board, setBoard] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const boardRes = await axios.get(
          `/api/v1/board/${boardId}/viewboard`,
          { withCredentials: true }
        );

        const listRes = await axios.get(
          `/api/v1/board/${boardId}/lists`,
          { withCredentials: true }
        );

        setBoard(boardRes.data.data);
        setList(listRes.data.data);
      } catch (err) {
        console.log("Error fetching board or lists", err);
        setError("Failed to load board");
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId]);

  if (loading) return <p>Loading board...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{board.title}</h1>
      <p className="text-gray-600">{board.description}</p>

      <hr className="my-4" />

      <h2 className="text-lg font-semibold">Lists</h2>

      <ListContainer list={list} />
    </div>
  );
}

export default Board