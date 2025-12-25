import React, { useState } from "react";
import ListCard from "./ListCard";
import CreateTask from "./CreateTask";

function ListContainer({ lists, tasksByList, onCreateTask }) {
  const [activeListId, setActiveListId] = useState(null);

  return (
    <div className="flex gap-4">
      {lists.map((list) => (
        <div key={list._id} className="w-72">
          <ListCard
            list={list}
            tasks={tasksByList[list._id] || []}
            onAddTask={() => setActiveListId(list._id)}
          />

          {activeListId === list._id && (
            <CreateTask
              listId={list._id}
              onClose={() => setActiveListId(null)}
              onCreateTask={(taskData) => onCreateTask(taskData, list._id)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ListContainer;
