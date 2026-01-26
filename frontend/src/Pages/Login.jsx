/**
Render login UI
Take email/password input
Call login() from AuthContext
Handle redirect to /boards
 */
import React, { useState } from "react";
import { useAuth } from "../Context/Auth.context";
import {useNavigate} from "react-router-dom"


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const navigate=useNavigate()

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      setLoading(true)
      await login({ email, password });
      navigate('/boards', { replace: true })
    } catch (error) {
      throw error; 
    }
    finally{
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] px-4">
      {/* Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] rounded-full bg-blue-900/20 blur-[100px]"></div>
      </div>
  
      <div className="w-full max-w-md z-10">
        <div className="bg-[#111827]/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
            <p className="text-sm text-gray-400">Sign in to your account</p>
          </div>
  
          <form onSubmit={onSubmitHandler} className="space-y-4">
            {/* Email Field - Reduced height */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-[#0d121f] border border-gray-700 rounded-lg py-2 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                placeholder="name@company.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
  
            {/* Password Field - Reduced height */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full bg-[#0d121f] border border-gray-700 rounded-lg py-2 px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                placeholder="••••••••"
                onChange={(e) => {setPassword(e.target.value)}}
              />
            </div>
  
            {/* Primary Sign In Button */}
            <button
              type="submit"
              className="w-full cursor-pointer mt-2 bg-linear-to-r from-[#00acee] to-[#0072ff] hover:brightness-110 text-white font-semibold py-2.5 rounded-lg shadow-[0_0_15px_rgba(0,172,238,0.2)] transition-all active:scale-[0.98] text-sm">
              Sign In
            </button>
  
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-[#111827] text-gray-500 uppercase tracking-wider">Or</span>
              </div>
            </div>
  
            {/* Google Button - Slimmer height */}
            <button
              onClick={() => {
                window.location.href = //http://localhost:3000/auth/google
                  import.meta.env.VITE_API_AUTH_URL + "/auth/google/callback";
              }}
              // 1️⃣ Browser → Backend /auth/google
              // 2️⃣ Backend → Google OAuth page
              // 3️⃣ User logs in
              // 4️⃣ Google → Backend callback
              // 5️⃣ Backend sets cookie + redirects
              // 6️⃣ Backend → http://localhost:5173/boards
              type="button"
              className="w-full flex cursor-pointer items-center justify-center gap-2 bg-[#1f2937] hover:bg-[#2d3748] text-white font-medium py-2 rounded-lg border border-gray-700 transition-all text-sm">
             <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google icon" />
              Google
            </button>
          </form>
  
          <p className="mt-6 text-center text-xs text-gray-500">
            New here?{' '}
            <a
            onClick={() => navigate("/signup")}
            className="text-blue-400 cursor-pointer hover:underline">Create account</a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Login;


