import { Kanban, CheckSquare, Users, Zap, ArrowRight, Layout, Clock } from 'lucide-react';
import React from 'react';
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white relative overflow-hidden font-sans">
      {/* Background Glow Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[35%] h-[50%] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[15%] w-[50%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Top Gradient Line */}
      <div className="fixed top-0 left-0 w-full h-1 bg-linear-to-r from-cyan-500/40 via-violet-500/40 to-blue-500/40 opacity-70 z-50" />

      <nav className="absolute top-0 w-full px-6 py-8 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 bg-linear-to-br from-cyan-400/20 to-blue-500/20 rounded-xl border border-cyan-400/20 group-hover:border-cyan-400/40 transition-all duration-300">
              <Kanban className="w-7 h-7 text-cyan-400 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400 tracking-tight">TaskDeck</span>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-lg"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-20 reveal-up">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 text-cyan-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-cyan-500/20 shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]">
              <Zap className="w-3.5 h-3.5" />
              <span>Project Management Redefined</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
              Organize Your Work,
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-violet-500 py-2">
                Achieve More.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
              TaskDeck brings all your tasks, teammates, and tools together. Keep everything organized and never miss a deadline with our high-performance visual boards.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16">
              <button 
                onClick={() => navigate('/signup')}
                className="group relative w-full sm:w-auto px-10 py-4 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-lg rounded-2xl shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)] hover:shadow-[0_0_50px_-5px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-10 py-4 bg-white/[0.02] backdrop-blur-md text-white font-bold text-lg rounded-2xl border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                View Demo
              </button> */}
            </div>

            <div className="flex items-center justify-center gap-10 text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-500" />
                <span>Unlimited Teams</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
              <div className="flex items-center gap-2">
                <Layout className="w-4 h-4 text-violet-500" />
                <span>Modern UX</span>
              </div>
            </div>
          </div>

          {/* Interactive Preview Container */}
          <div className="relative max-w-6xl mx-auto reveal-up reveal-delay-2">
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 via-blue-500 to-violet-500 rounded-[2.5rem] blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative bg-[#0d121f]/80 backdrop-blur-3xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/10">
              <div className="bg-white/[0.03] px-8 py-5 border-b border-white/5 flex items-center justify-between">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                  Live Workspace
                </div>
              </div>

              <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1 */}
                <div className="bg-white/[0.01] p-6 rounded-2xl border border-white/5 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-500 uppercase tracking-widest">To Do</span>
                    <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-bold text-gray-400">3</span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-[#0a0a0f]/60 p-5 rounded-xl border border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer">
                      <div className="font-bold text-white mb-3 text-sm group-hover:text-cyan-400 transition-colors">Design new landing page</div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2 py-1 rounded-md font-bold uppercase tracking-tighter border border-cyan-500/20">Design</span>
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-[10px] font-bold">K</div>
                      </div>
                    </div>
                    <div className="bg-[#0a0a0f]/40 p-5 rounded-xl border border-white/5 opacity-60">
                      <div className="font-bold text-white text-sm">Update documentation</div>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="bg-cyan-500/[0.03] p-6 rounded-2xl border border-cyan-500/10 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">In Progress</span>
                    <span className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-[10px] font-bold text-cyan-400">1</span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-[#0a0a0f]/80 p-5 rounded-xl border border-cyan-500/40 shadow-[0_0_20px_-10px_rgba(6,182,212,0.5)] group cursor-pointer">
                      <div className="font-bold text-white mb-3 text-sm">Build authentication flow</div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md font-bold uppercase tracking-tighter border border-emerald-500/20">Dev</span>
                        <div className="flex -space-x-2">
                          <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[10px] font-bold relative z-10">J</div>
                          <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold">S</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="bg-emerald-500/[0.02] p-6 rounded-2xl border border-emerald-500/10 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Completed</span>
                    <span className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-[10px] font-bold text-emerald-400">12</span>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-[#0a0a0f]/40 p-5 rounded-xl border border-white/5 opacity-50">
                      <div className="font-bold text-gray-400 line-through text-sm">Initial project setup</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-40 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto reveal-up reveal-delay-3">
            <div className="group bg-white/[0.02] backdrop-blur-sm p-10 rounded-3xl border border-white/5 hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all duration-500">
              <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 border border-cyan-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Layout className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Visual Boards</h3>
              <p className="text-gray-400 leading-relaxed font-medium">
                Organize tasks with intuitive drag-and-drop boards that make project management feel effortless and natural.
              </p>
            </div>

            <div className="group bg-white/[0.02] backdrop-blur-sm p-10 rounded-3xl border border-white/5 hover:border-violet-500/30 hover:bg-white/[0.04] transition-all duration-500">
              <div className="w-14 h-14 bg-violet-500/10 rounded-2xl flex items-center justify-center mb-8 border border-violet-500/20 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                <Users className="w-7 h-7 text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Team Collaboration</h3>
              <p className="text-gray-400 leading-relaxed font-medium">
                Work together seamlessly with real-time updates, assignee management, and instant feedback loops.
              </p>
            </div>

            <div className="group bg-white/[0.02] backdrop-blur-sm p-10 rounded-3xl border border-white/5 hover:border-blue-500/30 hover:bg-white/[0.04] transition-all duration-500">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Boost Productivity</h3>
              <p className="text-gray-400 leading-relaxed font-medium">
                Stay focused and hit deadlines with powerful tracking tools designed to keep your high-velocity team on track.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-12 px-6 mt-20 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
            <Kanban className="w-5 h-5 text-cyan-400" />
            <span className="text-lg font-bold text-white">TaskDeck</span>
          </div>
          <p className="text-gray-500 text-sm font-medium">© 2024 TaskDeck. Built for teams that move fast.</p>
          <div className="flex gap-6 text-gray-500 text-sm font-medium">
            <a href="#" className="hover:text-cyan-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Github</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
;