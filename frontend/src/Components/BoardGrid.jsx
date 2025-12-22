import React from "react";

const BoardGrid = ({boards}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
     
      {/* Board Card */}
      <div className="rounded-md bg-white p-4 shadow hover:shadow-lg cursor-pointer">
        <h3 className="text-lg font-semibold">Project Alpha</h3>
        <p className="mt-1 text-sm text-gray-600">
          Marketing website redesign
        </p>
      </div>

    </div>
  );
};

export default BoardGrid;
