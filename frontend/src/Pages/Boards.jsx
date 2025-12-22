import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  //createBoard
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!title || !description) alert("Pls fill all the detail completely")
    try {
      const res= await axios.post("/api/v1/boards/createboard", {title: title, description: description}, {withCredentials:true})

    } catch (error) {
      console.log("error has occurred", error);
      
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get("/api/v1/boards", {
          withCredentials: true,
        });

        setBoards(response.data?.data || []);
      } catch (err) {
        console.error(
          "Error fetching boards:",
          err.response?.data?.message || err.message
        );
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
      </div>

      {/* Create Board UI (UI ONLY — no logic) */}
      <form onSubmit={handleSubmit}>
        <div className="mb-8 rounded-md bg-white p-4 shadow">
          <h2 className="mb-3 text-lg font-semibold">Create a new board</h2>

          <div className="flex gap-3">
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Board title"
              className="flex-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="flex-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="rounded-md bg-blue-600 px-4 py-2 text-white">Create</button>
          </div>
        </div>
      </form>

      {/* Boards Grid */}
      {boards.length === 0 ? (
        <p>No boards found</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {boards.map((board) => (
            <div
              key={board._id}
              onClick={() => navigate(`/boards/${board._id}`)}
              className="cursor-pointer rounded-md bg-white p-4 shadow transition hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold">{board.title}</h3>
              <p className="mt-1 text-sm text-gray-600">
                {board.description || "No description"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Boards;
