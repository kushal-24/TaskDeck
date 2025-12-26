import React, { useState } from "react";
import ListCard from "./ListCard";
import CreateTask from "./CreateTask.jsx";

function ListContainer({ lists, tasksByList, onCreateTask, onEditList, onDeleteList, onTaskClick }) {
  const [activeListId, setActiveListId] = useState(null);

  return (
    <div className="flex gap-4">
      {lists.map((list) => (
        <>
        <div key={list._id} className="w-72">
          <ListCard //mapped all the current tasks
            list={list}
            tasks={tasksByList[list._id] || []}
            onAddTask={() => setActiveListId(list._id)}
            onTaskClick={onTaskClick}
            onEditList={onEditList}
          />
          {activeListId === list._id && (
            <CreateTask //to create a new task button and pop down
              listId={list._id}
              onClose={() => setActiveListId(null)}
              onCreateTask={(taskData) => onCreateTask(taskData, list._id)}
              /*
              When CreateTask gives me taskData,
              I will call Board’s onCreateTask
              and I’ll ATTACH the current listId myself.
              */
            //  onEditTask={onEditTask}
            />
          )}
        </div>
        <button
          onClick={()=>onDeleteList(list._id)}
          className="w-full rounded-lg bg-blue-600 py-2 text-sm mt-4 font-medium text-white hover:bg-blue-700">
          Delete List
        </button>
        </>
      ))}
    </div>
  );
}

export default ListContainer;
