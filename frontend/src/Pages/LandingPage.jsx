import { Kanban, CheckSquare, Users, Zap, ArrowRight, Layout } from 'lucide-react';
import React from 'react';
import {useNavigate} from "react-router-dom"


function LandingPage() {

  const navigate=useNavigate()

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="absolute top-0 w-full px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Kanban className="w-8 h-8 text-cyan-400" strokeWidth={2.5} />
            <span className="text-2xl font-bold text-white">TaskDeck</span>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-cyan-500/20 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-cyan-500/30">
              <Zap className="w-4 h-4" />
              <span>The modern way to manage projects</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Organize Your Work,
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-400">
                Achieve More
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
              TaskFlow brings all your tasks, teammates, and tools together. Keep everything organized and never miss a deadline with visual project boards.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <button 
              onClick={()=>navigate('/signup')}
              className="group w-full sm:w-auto bg-linear-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg shadow-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
              onClick={()=>navigate('/login')}
              className="w-full sm:w-auto bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold text-lg border-2 border-slate-700 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:-translate-y-0.5">
                Sign In
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Free for small teams</span>
              </div>
            </div>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-linear-to-r from-cyan-600 to-blue-600 rounded-2xl blur-3xl opacity-15"></div>
            <div className="relative bg-slate-800/50 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
              <div className="bg-slate-900/80 px-6 py-4 border-b border-slate-700 flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-700/30 p-6 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-300">TO DO</span>
                    <span className="w-6 h-6 rounded-full bg-slate-600 flex items-center justify-center text-xs font-bold text-gray-300">3</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-800/60 p-4 rounded-lg shadow-sm border border-slate-600 hover:shadow-md hover:border-slate-500 transition-all">
                      <div className="font-medium text-white mb-2">Design new landing page</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded border border-cyan-500/50">Design</span>
                      </div>
                    </div>
                    <div className="bg-slate-800/60 p-4 rounded-lg shadow-sm border border-slate-600">
                      <div className="font-medium text-white">Update documentation</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-600/20 p-6 rounded-xl border border-blue-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-blue-300">IN PROGRESS</span>
                    <span className="w-6 h-6 rounded-full bg-blue-600/40 flex items-center justify-center text-xs font-bold text-blue-300">2</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-800/60 p-4 rounded-lg shadow-sm border border-blue-500/20 hover:shadow-md hover:border-blue-500/40 transition-all">
                      <div className="font-medium text-white mb-2">Build authentication flow</div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-green-500/30 text-green-300 px-2 py-1 rounded border border-green-500/50">Dev</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-600/20 p-6 rounded-xl border border-green-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-green-300">DONE</span>
                    <span className="w-6 h-6 rounded-full bg-green-600/40 flex items-center justify-center text-xs font-bold text-green-300">5</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-slate-800/60 p-4 rounded-lg shadow-sm border border-green-500/20 opacity-75">
                      <div className="font-medium text-gray-400 line-through">Setup project structure</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-32 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-800/40 p-8 rounded-2xl shadow-lg border border-slate-700 hover:border-slate-600 hover:shadow-xl hover:shadow-cyan-500/10 transition-all">
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 border border-cyan-500/30">
                <Layout className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Visual Boards</h3>
              <p className="text-gray-400 leading-relaxed">
                Organize tasks with intuitive drag-and-drop boards that make project management effortless.
              </p>
            </div>

            <div className="bg-slate-800/40 p-8 rounded-2xl shadow-lg border border-slate-700 hover:border-slate-600 hover:shadow-xl hover:shadow-cyan-500/10 transition-all">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 border border-blue-500/30">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Team Collaboration</h3>
              <p className="text-gray-400 leading-relaxed">
                Work together seamlessly with real-time updates and instant notifications for your team.
              </p>
            </div>

            <div className="bg-slate-800/40 p-8 rounded-2xl shadow-lg border border-slate-700 hover:border-slate-600 hover:shadow-xl hover:shadow-cyan-500/10 transition-all">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 border border-green-500/30">
                <Zap className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Boost Productivity</h3>
              <p className="text-gray-400 leading-relaxed">
                Stay focused and hit deadlines with powerful tools designed to keep your team on track.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-700 py-8 px-6 mt-20">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p>© 2024 TaskFlow. Built for teams that move fast.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;