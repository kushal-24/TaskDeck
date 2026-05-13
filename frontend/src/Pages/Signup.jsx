import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupApi } from "../Api/auth.api";
import { Kanban, ArrowRight } from "lucide-react";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      return;
    }

    setLoading(true);

    try {
      await signupApi({
        fullName,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      // Signup error
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-4 relative overflow-hidden font-sans">
      {/* Background Glow Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] -right-[5%] w-[35%] h-[50%] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[15%] w-[50%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      {/* Top Gradient Line */}
      <div className="fixed top-0 left-0 w-full h-1 bg-linear-to-r from-cyan-500/40 via-violet-500/40 to-blue-500/40 opacity-70 z-50" />

      {/* Branding */}
      <div 
        onClick={() => navigate("/")} 
        className="absolute top-8 left-8 flex items-center gap-3 group cursor-pointer z-50"
      >
        <div className="p-2 bg-linear-to-br from-cyan-400/20 to-blue-500/20 rounded-xl border border-cyan-400/20 group-hover:border-cyan-400/40 transition-all duration-300">
          <Kanban className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" strokeWidth={2.5} />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400 tracking-tight">TaskDeck</span>
      </div>
  
      <div className="w-full reveal-up max-w-md z-10">
        <div className="bg-[#0d121f]/80 backdrop-blur-3xl p-8 rounded-[2rem] border border-white/10 shadow-[0_0_60px_-15px_rgba(6,182,212,0.15)]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Create Account</h2>
            <p className="text-sm font-medium text-gray-500">Join TaskDeck to start organizing</p>
          </div>
  
          <form onSubmit={onSubmitHandler} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
              <input
                type="text"
                required
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all shadow-inner"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Email Address</label>
              <input
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all shadow-inner"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 ml-1">Password</label>
              <input
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0a0a0f]/50 border border-white/10 rounded-xl py-3 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all shadow-inner"
                placeholder="Create a strong password"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="group relative w-full cursor-pointer mt-2 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98] text-sm overflow-hidden disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Creating Account..." : "Get Started Free"}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-[#0d121f] text-[10px] font-black text-gray-600 uppercase tracking-widest">
                  Or sign up with
                </span>
              </div>
            </div>

            <button 
              onClick={() => {
                window.location.href = import.meta.env.VITE_API_AUTH_URL + "/auth/google";
              }}
              className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl border border-white/10 transition-all text-sm"
              type="button"
            >
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google icon" />
              Google
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-medium text-gray-500">
            Already have an account? 
            <a 
              onClick={()=> navigate('/login')}
              className="text-cyan-400 cursor-pointer font-bold hover:text-cyan-300 transition-colors ml-1"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
