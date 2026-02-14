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
import CreateList from "./CreateList.jsx";

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
    <div ref={setNodeRef} style={style}>
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
  ownerId,
  lists,
  tasksByList,
  onCreateTask,
  onCreateList,
  onEditList,
  onDeleteList,
  boardData,
  onFetchComments,
  onTaskClick,
  animate
}) {
  const [activeListId, setActiveListId] = useState(null);
  const { user } = useAuth();

  return (
    <div className="px-6 py-4 flex flex-col">
      <div className="flex gap-8 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <SortableContext
          items={lists.map((list) => list._id)}
          strategy={horizontalListSortingStrategy}>
          {lists.map((list) => {
            const canDeleteList = user && list.createdBy === user._id;
            return (
              <SortableList key={list._id} list={list}>
                <ListCard
                  animate={animate}
                  index={list._id}
                  ownerId={ownerId}
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
                    className="mt-4 w-full rounded-lg cursor-pointer bg-red-600 hover:bg-red-500 py-2 text-sm text-white">
                    Delete List
                  </button>
                )}
              </SortableList>
            );
          })}
        </SortableContext>
        <div className="w-72 mt-2 shrink-0">
          <CreateList onCreateList={onCreateList} />
        </div>
      </div>
    </div>
  );
}

export default ListContainer;
