import React from "react";

const BoardGrid = ({boards}) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      
      {/* Board Title */}
      {boards.map((board)=>{
        <h3 className="text-lg font-semibold text-gray-800">
        {board.title}</h3>

      {/* Optional subtitle */}
      <p className="mt-1 text-sm text-gray-500">
       {board.description} hiiiiiiii
      </p>
      })}

    </div>
  );
};

export default BoardGrid;
