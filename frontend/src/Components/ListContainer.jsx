import React, { useState } from "react";
import ListCard from "./ListCard";
import CreateTask from "./CreateTask";

function ListContainer({ lists, tasksByList, onCreateTask, onDeleteTask, onTaskClick }) {
  const [activeListId, setActiveListId] = useState(null);

  return (
    <div className="flex gap-4">
      {lists.map((list) => (
        <div key={list._id} className="w-72">
          <ListCard
            list={list}
            tasks={tasksByList[list._id] || []}
            onAddTask={() => setActiveListId(list._id)}
            onTaskClick={onTaskClick}
          />

          {activeListId === list._id && (
            <CreateTask
              listId={list._id}
              onClose={() => setActiveListId(null)}
              onCreateTask={(taskData) => onCreateTask(taskData, list._id)}
              /*
              When CreateTask gives me taskData,
              I will call Board’s onCreateTask
              and I’ll ATTACH the current listId myself.
              */

             onDeleteTask={onDeleteTask}
            //  onEditTask={onEditTask}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ListContainer;
