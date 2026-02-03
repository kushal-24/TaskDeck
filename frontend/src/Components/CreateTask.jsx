import React, { useState } from "react";
import { X } from 'lucide-react';

function CreateTask({  onCreateTask, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const handleCreateTask = (e) => {
    e.preventDefault();

    if (!title || !description) return;

    onCreateTask({
      title,
      description,
      priority,
      dueDate: dueDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
  
      {/* Modal */}
      <div className="relative reveal-up w-full max-w-md bg-linear-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-cyan-500/20 overflow-hidden">
        
        {/* Subtle glow */}
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/5 to-transparent pointer-events-none" />
  
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
            <h2 className="text-xl font-bold text-white">Create Task</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
  
          {/* Form */}
          <div className="p-6 space-y-5">
            {/* Title */}
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
                className="mt-2 w-full px-4 py-3 bg-white/5 border border-cyan-500/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
  
            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description"
                className="mt-2 w-full px-4 py-3 bg-white/5 border border-cyan-500/40 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
              />
            </div>
  
            {/* Priority */}
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-2 w-full px-4 py-3 bg-white/5 border border-cyan-500/40 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
  
            {/* Due Date */}
            <div>
              <label className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-2 w-full px-4 py-3 bg-white/5 border border-cyan-500/40 rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
            </div>
          </div>
  
          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-cyan-500/20 bg-linear-to-r from-slate-900/50 to-slate-800/50">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTask}
              className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/30"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default CreateTask;