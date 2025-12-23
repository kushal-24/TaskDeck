import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBoardApi } from "../Api/board.api";

const CreateBoard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await createBoardApi({ title, description });

      const newBoardId = res.data.data._id;
      
      //go back to boards main pg
      navigate("/boards");
    } catch (err) {
      setError("Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Create New Board</h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Board title"
            className="w-full border px-3 py-2 rounded"
          />

          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full border px-3 py-2 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Creating..." : "Create Board"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBoard;
