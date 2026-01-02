import { Bell, User, Kanban } from "lucide-react";

function Boards() {
  const boards = [
    {
      id: 1,
      title: "Project Alpha",
      owner: "Sarah Johnson",
      image:
        "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 2,
      title: "Marketing Campaign",
      owner: "Michael Chen",
      image:
        "https://images.pexels.com/photos/7413915/pexels-photo-7413915.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 3,
      title: "Product Design",
      owner: "Emma Wilson",
      image:
        "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: 4,
      title: "Development Sprint",
      owner: "James Martinez",
      image:
        "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[85%] max-w-4xl">
        <nav className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl px-5 py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Kanban className="w-8 h-8 text-cyan-400" strokeWidth={2.5} />
              <span className="text-lg font-bold text-white">TaskDeck</span>
            </div>

            <div className="flex items-center gap-3">
              <button className="p-1.5 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 group">
                <Bell className="w-5 h-5 text-gray-300 group-hover:text-cyan-400 transition-colors" />
              </button>

              <button className="p-1.5 rounded-xl backdrop-blur-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 group">
                <User className="w-5 h-5 text-gray-300 group-hover:text-cyan-400 transition-colors" />
              </button>
            </div>
          </div>
        </nav>
      </div>

      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, Kushal
          </h1>
          <p className="text-gray-400">Here's what you've been working on</p>
        </div>

        <div className="m-3 flex justify-end">
          <button
          className="relative flex items-center gap-2 border border-white/10 rounded-xl px-6 py-3 text-sm font-semibold text-cyan-400  bg-white/5 backdrop-blur-md hover:bg-cyan-400/10 hover:border-cyan-400/60 transition-all duration-300">
            <span className="text-lg leading-none">+</span>
            Create New Board
            </button>
            </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {boards.map((board) => (
            <div
              key={board.id}
              className="group cursor-pointer backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10">
              <div className="relative h-36 overflow-hidden">
                <img
                  src={board.image}
                  alt={board.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
              </div>

              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {board.title}
                </h3>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-medium">
                    {board.owner.charAt(0)}
                  </div>
                  <span className="text-gray-400 text-xs">{board.owner}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Activity Log</h2>
            <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-200"
              >
                <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-200 text-sm mb-1">{log.action}</p>
                  <span className="text-gray-500 text-xs">{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Boards;
