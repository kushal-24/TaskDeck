import React, { useState } from "react";
import ListCard from "./ListCard";
import CreateTask from "./CreateTask.jsx";
import { useAuth } from "../Context/Auth.context.jsx";
import {
  useSortable,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableList = ({ list, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: list._id,
      data: { type: "LIST" },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="w-72">
      {/* LIST DRAG HANDLE */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-gray-500 text-xs mb-1 select-none"
      >
        ⠿
      </div>

      {/* Fully clickable list content */}
      {children}
    </div>
  );
};

function ListContainer({
  lists,
  tasksByList,
  onCreateTask,
  onEditList,
  onDeleteList,
  boardData,
  onFetchComments,
  onTaskClick,
}) {
  const [activeListId, setActiveListId] = useState(null);
  const { user } = useAuth();

  return (
    <div className="flex gap-4">
      <SortableContext
        items={lists.map((list) => list._id)}
        strategy={horizontalListSortingStrategy}
      >
        {lists.map((list) => {
          const canDeleteList = user && list.createdBy === user._id;

          return (
            <SortableList key={list._id} list={list}>
              <ListCard
                list={list}
                tasks={tasksByList[list._id] || []}
                onAddTask={() => setActiveListId(list._id)}
                onTaskClick={onTaskClick}
                onEditList={onEditList}
                boardData={boardData}
                onFetchComments={onFetchComments}
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
            </SortableList>
          );
        })}
      </SortableContext>
    </div>
  );
}


export default ListContainer;
