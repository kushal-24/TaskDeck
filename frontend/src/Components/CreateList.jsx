import React, { useState } from "react";

const CreateList = ({onCreateList}) => {
  const [title, setTitle] = useState("");
  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateList(title);
    setTitle("");
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800">Create New List</h2>
      <p className="mt-1 text-sm text-gray-500">
        Add a title and description for your list
      </p>

      {/* Divider */}
      <div className="my-4 h-px bg-gray-200" />

      {/* Title Input */}

      <form onSubmit={onSubmitHandler}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            List Title
          </label>
          <input
            type="text"
            placeholder="Enter list title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action */}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700">
          Create List
        </button>
      </form>
    </div>
  );
};

export default CreateList;
