# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




  // return (
  //   <div className="fixed inset-0 z-50 flex items-center justify-center">
  //     <div className="absolute inset-0 bg-black/40" />

  //     {/* Modal */}
  //     <div className="relative w-full max-w-5xl rounded-xl bg-white shadow-xl flex flex-col">
  //       {/* Header */}
  //       <div className="flex items-center justify-between border-b px-6 py-4">
  //         {!editableTask ? (
  //           <h2 className="text-lg font-semibold text-gray-800">
  //             {task.title}
  //           </h2>
  //         ) : (
  //           <input
  //             value={title}
  //             onChange={(e) => setTitle(e.target.value)}
  //             className="w-full rounded border px-2 py-1 text-lg font-semibold"
  //           />
  //         )}
  //         <button
  //           onClick={onClose}
  //           className="text-gray-400 hover:text-gray-600"
  //         >
  //           ✕
  //         </button>
  //       </div>

  //       {/* BODY */}
  //       <div className="grid grid-cols-3 gap-6 px-6 py-5 h-[70vh] min-h-0">
  //         {/* LEFT */}
  //         <div className="col-span-2 space-y-6 overflow-y-auto pr-2 min-h-0">
  //           {/* Meta */}
  //           <div className="grid grid-cols-2 gap-4 text-sm">
  //             <div>
  //               <p className="text-gray-500">Due Date</p>
  //               {!editableTask ? (
  //                 <p className="font-medium">{task.dueDate}</p>
  //               ) : (
  //                 <input
  //                   type="date"
  //                   value={dueDate}
  //                   onChange={(e) => setDueDate(e.target.value)}
  //                   className="rounded border px-2 py-1"
  //                 />
  //               )}
  //             </div>

  //             <div>
  //               <p className="text-gray-500">Priority</p>
  //               {!editableTask ? (
  //                 <p className="font-medium">{task.priority}</p>
  //               ) : (
  //                 <select
  //                   value={priority}
  //                   onChange={(e) => setPriority(e.target.value)}
  //                   className="rounded border px-2 py-1">
  //                   <option value="low">Low</option>
  //                   <option value="medium">Medium</option>
  //                   <option value="high">High</option>
  //                 </select>
  //               )}
  //             </div>
  //           </div>

  //           {/* Description */}
  //           <div>
  //             <p className="mb-1 text-sm font-medium text-gray-700">
  //               Description
  //             </p>
  //             {!editableTask ? (
  //               <p className="text-sm text-gray-600">{task.description}</p>
  //             ) : (
  //               <textarea
  //                 value={description}
  //                 onChange={(e) => setDescription(e.target.value)}
  //                 className="w-full rounded border px-2 py-1 text-sm"
  //               />
  //             )}
  //           </div>

  //           {/* Assignees */}
  //           <div className="flex items-center gap-3">
  //             <div className="flex -space-x-2">
  //               <div className="h-8 w-8 rounded-full bg-gray-300" />
  //               <div className="h-8 w-8 rounded-full bg-gray-400" />
  //               <div className="h-8 w-8 rounded-full bg-gray-500" />
  //             </div>

  //             <p className="text-sm font-medium text-gray-700">
  //               {task.assignees
  //                 .map((id) =>
  //                   formatName(members.find((m) => m._id === id)?.fullName)
  //                 )
  //                 .filter(Boolean)
  //                 .join(", ")}
  //             </p>

  //             <UserDropdown
  //               taskData={task}
  //               members={members}
  //               onAddAssignee={onAddAssignee}
  //               onRemoveAssignee={onRemoveAssignee}
  //             />
  //           </div>

  //           {/* Attachments */}
  //           {/* Attachments */}
  //           <div>
  //             <p className="mb-2 text-sm font-medium text-gray-700">
  //               Attachments
  //             </p>

  //             {/* Upload box */}
  //             {!uploadedFile && (
  //               <div className="rounded-lg border border-dashed border-gray-300 p-4 text-center text-sm text-gray-500 space-y-2">
  //                 <input
  //                   type="file"
  //                   accept="image/*"
  //                   onChange={(e)=>setFile(e.target.files[0])}
  //                 />

  //                 {file && (
  //                   <button
  //                     onClick={handleAttachFile}
  //                     className="block mx-auto rounded bg-blue-600 px-3 py-1 text-sm text-white">
  //                     Upload file
  //                   </button>
  //                 )}
  //               </div>
  //             )}

  //             {/* Uploaded preview */}
  //             {uploadedFile && (
  //               <div className="flex items-center justify-between rounded border p-3">
  //                 <a
  //                   href={uploadedFile.url}
  //                   target="_blank"
  //                   rel="noreferrer"
  //                   className="text-sm text-blue-600 underline"
  //                 >
  //                   View attachment
  //                 </a>

  //                 <button
  //                   onClick={handleDeleteFile}
  //                   className="text-sm text-red-600 hover:underline"
  //                 >
  //                   Remove
  //                 </button>
  //               </div>
  //             )}
  //           </div>
  //         </div>

  //         {/* RIGHT — COMMENTS */}
  //         <div className="col-span-1 border-l pl-4 flex flex-col min-h-0">
  //           <p className="mb-3 text-sm font-medium text-gray-700">Comments</p>

  //           <div className="flex-1 overflow-y-auto space-y-4 pr-2 min-h-0">
  //             {comments.map((c) => (
  //               <div key={c._id} className="rounded-lg border bg-gray-50 p-3">
  //                 {editingCommentId === c._id ? (
  //                   <input
  //                     value={content}
  //                     onChange={(e) => setContent(e.target.value)}
  //                     className="text-sm text-gray-800 w-full rounded border px-2 py-1"
  //                   />
  //                 ) : (
  //                   <p className="text-sm text-gray-800">{c.content}</p>
  //                 )}

  //                 <div className="mt-2 flex gap-3 text-xs text-gray-500">
  //                   {!editingCommentId ? (
  //                     <span
  //                       onClick={() => startEditComment(c)}
  //                       className="cursor-pointer hover:text-gray-700">
  //                       Edit
  //                     </span>
  //                   ) : (
  //                     <span
  //                       onClick={() => saveEditComment(c)}
  //                       className="cursor-pointer hover:text-gray-700" >
  //                       Save changes
  //                     </span>
  //                   )}
  //                   <span
  //                     onClick={() => onDeleteComment(c._id)}
  //                     className="cursor-pointer hover:text-red-600">
  //                     Delete
  //                   </span>
  //                   <span className="font-bold">{c.userId}</span>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>

  //           {/* Add Comment */}
  //           <div className="mt-3">
  //             <textarea
  //               rows="2"
  //               value={comment}
  //               onChange={(e) => setComment(e.target.value)}
  //               placeholder="Write a comment..."
  //               className="w-full resize-none rounded border px-3 py-2 text-sm"/>
  //             <button
  //               onClick={handleAddComment}
  //               className="mt-2 rounded bg-blue-100 px-3 py-1 text-sm text-blue-700 hover:bg-blue-200">
  //               Add Comment
  //             </button>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Footer */}
  //       <div className="flex items-center justify-between border-t px-6 py-4">
  //         <button
  //           onClick={handleDeleteTask}
  //           className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200">
  //           Delete Task
  //         </button>

  //         {!editableTask ? (
  //           <button
  //             onClick={startEditTask}
  //             className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
  //             Edit Task
  //           </button>
  //         ) : (
  //           <button
  //             onClick={saveEditTask}
  //             className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white">
  //             Update Task
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );