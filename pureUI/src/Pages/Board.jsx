// import { Edit2, Trash2 } from "lucide-react";
// import LetterAvatar from "../Components/LetterAvatar.jsx";

// const BoardHeader = ({
//   title = "Product Launch 2024",
//   description = "Planning and executing our major product launch for Q2 2024",
//   onEdit = () => console.log("Edit board clicked"),
//   onDelete = () => console.log("Delete board clicked"),
// }) => {
//   const sampleMembers = [
//     { id: "1", name: "Sarah Johnson", letter: "S" },
//     { id: "2", name: "Mike Chen", letter: "M" },
//     { id: "3", name: "Emma Davis", letter: "E" },
//     { id: "4", name: "James Wilson", letter: "J" },
//   ];

//   return (
//     <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-700/50">
//       <div className="mx-auto max-w-7xl px-6 py-4">
//         <div className="flex items-start justify-between">

//           {/* Left: Board Info */}
//           <div className="flex-1">
//             <h1 className="mb-2 text-3xl font-bold text-white">
//               {title}
//             </h1>
//             <p className="text-lg text-slate-400">
//               {description}
//             </p>
//           </div>

//           {/* Right: Members + Actions */}
//           <div className="flex items-center gap-4">

//             {/* Members */}
//             <div className="flex items-center -space-x-3">
//               {sampleMembers.map((member, index) => (
//                 <div
//                   key={member.id}
//                   className="relative group"
//                   style={{ zIndex: sampleMembers.length - index }}
//                 >
//                   <div className="rounded-full border-2 border-[#0a1929] transition-transform group-hover:scale-110">
//                     <LetterAvatar letter={member.letter} size={40} />
//                   </div>

//                   {/* Tooltip */}
//                   <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-3 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
//                     {member.name}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Edit */}
//             <button
//               onClick={onEdit}
//               className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-white transition-colors hover:bg-cyan-600"
//             >
//               <Edit2 size={18} />
//               Edit Board
//             </button>

//             {/* Delete */}
//             <button
//               onClick={onDelete}
//               className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-white transition-colors hover:bg-red-600"
//             >
//               <Trash2 size={18} />
//               Delete Board
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BoardHeader;

import { Edit2, Trash2 } from "lucide-react";
import React from "react";
import LetterAvatar from "../Components/LetterAvatar";

function Board(
    {
      title = "Product Launch 2024",
      description = "Planning and executing our major product launch for Q2 2024",
      onEdit = () => console.log("Edit board clicked"),
      onDelete = () => console.log("Delete board clicked"),
    }) {
  const lists = [
    { id: 1, title: "To Do", items: [] },
    { id: 2, title: "In Progress", items: [] },
    { id: 3, title: "Review", items: [] },
    { id: 4, title: "Completed", items: [] },
  ];
  const sampleMembers = [
        { id: "1", name: "Sarah Johnson", letter: "S" },
        { id: "2", name: "Mike Chen", letter: "M" },
        { id: "3", name: "Emma Davis", letter: "E" },
        { id: "4", name: "James Wilson", letter: "J" },
    ];

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      <nav>
        <div className=" border-b border-slate-700/50">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-start justify-between">
              {/* Left: Board Info */}
              <div className="flex-1">
                <h1 className="mb-2 text-3xl font-bold text-white">{title}</h1>
                <p className="text-lg text-slate-400">{description}</p>
              </div>

              {/* Right: Members + Actions */}
              <div className="flex items-center gap-4">
                {/* Members */}
                <div className="flex items-center -space-x-3">
                  {sampleMembers.map((member, index) => (
                    <div
                      key={member.id}
                      className="relative group"
                      style={{ zIndex: sampleMembers.length - index }}
                    >
                      <div className="rounded-full border-2 border-[#0a1929] transition-transform group-hover:scale-110">
                        <LetterAvatar letter={member.letter} size={40} />
                      </div>

                      {/* Tooltip */}
                      <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-3 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {member.name}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit */}
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-white transition-colors hover:bg-cyan-600"
                >
                  <Edit2 size={18} />
                  Edit Board
                </button>

                {/* Delete */}
                <button
                  onClick={onDelete}
                  className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-white transition-colors hover:bg-red-600"
                >
                  <Trash2 size={18} />
                  Delete Board
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="px-6 py-8">
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {lists.map((list) => (
            <div
              key={list.id}
              className="shrink-0 w-80 h-[600px] bg-linear-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-md rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-gray-700/50 bg-black/20">
                <h2 className="text-lg font-semibold text-white">
                  {list.title}
                </h2>
              </div>

              <div className="p-4 overflow-y-auto h-[calc(100%-60px)] space-y-3">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 hover:border-cyan-500/50 transition-all cursor-pointer">
                  <p className="text-gray-200 text-sm">Sample task item</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 hover:border-cyan-500/50 transition-all cursor-pointer">
                  <p className="text-gray-200 text-sm">Another task here</p>
                </div>
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700/30 hover:border-cyan-500/50 transition-all cursor-pointer">
                  <p className="text-gray-200 text-sm">
                    More items can be added
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Board;
