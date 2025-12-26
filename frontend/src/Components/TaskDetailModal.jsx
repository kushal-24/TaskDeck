import React from "react";
import { useParams } from "react-router-dom";


const TaskDetailModal = ({task, onClose}) => {
  if (!task) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" />
  
        {/* Modal */}
        <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Task Title Goes Here
            </h2>
  
            <button 
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
  
          {/* Body */}
          <div className="space-y-6 px-6 py-5">
            
            {/* Meta */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Due Date</p>
                <p className="font-medium text-gray-800">25 Dec 2025</p>
              </div>
  
              <div>
                <p className="text-gray-500">Priority</p>
                <span className="inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                  High
                </span>
              </div>
            </div>
  
            {/* Description */}
            <div>
              <p className="mb-1 text-sm font-medium text-gray-700">
                Description
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                This task involves designing the authentication flow and
                integrating it with the backend API.
              </p>
            </div>
  
            {/* Assignees */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Assignees
              </p>
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-gray-300" />
                <div className="h-8 w-8 rounded-full bg-gray-400" />
                <div className="h-8 w-8 rounded-full bg-gray-500" />
              </div>
            </div>
  
            {/* Attachments */}
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">
                Attachments
              </p>
              <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500">
                Drag & drop files or click to upload
              </div>
            </div>
          </div>
  
          {/* Footer */}
          <div className="flex items-center justify-between border-t px-6 py-4">
            <button className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200">
              Delete Task
            </button>
  
            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Edit Task
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default TaskDetailModal;
  