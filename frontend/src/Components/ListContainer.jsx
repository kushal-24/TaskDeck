import React, { useState } from "react";
import ListCard from "./ListCard";
import CreateTask from "./CreateTask.jsx";
import { useAuth } from "../Context/Auth.context.jsx";

function ListContainer({
  lists,
  tasksByList,
  onCreateTask,
  onEditList,
  onDeleteList,
  onTaskClick,
  boardData,
}) {
  const [activeListId, setActiveListId] = useState(null);
  const { user } = useAuth();

  return (
    <div className="flex gap-4">
      {lists.map((list) => {
        const canDeleteList = list.createdBy === user._id;

        return (
          <div key={list._id} className="w-72">
            <ListCard
              list={list}
              tasks={tasksByList[list._id] || []}
              onAddTask={() => setActiveListId(list._id)}
              onTaskClick={onTaskClick}
              onEditList={onEditList}
              boardData={boardData}
            />

            {activeListId === list._id && (
              <CreateTask
                onClose={() => setActiveListId(null)}
                onCreateTask={(taskData) =>
                  onCreateTask(taskData, list._id)
                }
              />
            )}

            {canDeleteList && (
              <button
                onClick={() => onDeleteList(list._id)}
                className="mt-4 w-full rounded-lg bg-red-600 py-2 text-sm text-white"
              >
                Delete List
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ListContainer;
