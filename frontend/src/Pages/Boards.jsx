/**
 * Boards Page
 * - Fetch all boards
 * - Store boards in state
 * - Render board cards via components
 * - Navigate to create board page
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllBoardsApi } from "../Api/board.api";

import BoardGrid from "../Components/BoardGrid.jsx";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ✅ Fetch all boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await getAllBoardsApi();
        setBoards(res.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch boards");
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  if (loading) {
    return <div className="p-6">Loading boards...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Boards</h1>

        {/* ➕ Create board button */}
        <button
          onClick={() => navigate("/boards/new")}
          className="rounded-md bg-blue-600 px-4 py-2 text-white">
          Create New Board
        </button>
      </div>

      {/* Boards List (UI delegated to components) */}
      <BoardGrid
        boards={boards}
        onBoardClick={(boardId) => navigate(`/boards/${boardId}`)}
      />
    </div>
  );
};

export default Boards;
