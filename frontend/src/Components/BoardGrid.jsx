import React from "react";

const BoardGrid = ({ boards, onBoardClick }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm grid grid-cols-2 gap-4">
      {boards.map((board) => (
        <div
          key={board._id}
          onClick={() => onBoardClick(board._id)}
          className="cursor-pointer rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">
            {board.title}
          </h3>

          {/* Optional subtitle */}
          {/* <p className="mt-1 text-sm text-gray-500">
            {board.description}
          </p> */}
        </div>
      ))}
    </div>
  );
};

export default BoardGrid;
