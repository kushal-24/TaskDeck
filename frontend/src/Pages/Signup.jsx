import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupApi } from "../Api/auth.api";

const Signup = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      console.log("All fields are required");
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
      console.log("Signup error:", error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f1e] px-4 relative overflow-hidden">
      {/* Brand Logo in Top Left */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="flex gap-1 items-end">
            <div className="w-1.5 h-6 bg-[#00acee] rounded-full"></div>
            <div className="w-1.5 h-4 bg-[#00acee] rounded-full"></div>
            <div className="w-1.5 h-8 bg-[#00acee] rounded-full"></div>
        </div>
        <span className="text-white text-xl font-bold tracking-tight">TaskDeck</span>
      </div>
  
      <div className="w-full max-w-md z-10">
        <div className="bg-[#111827]/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-800 shadow-2xl">
          <div className="text-center mb-5">
            <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
            <p className="text-sm text-gray-400">Join TaskFlow to start organizing</p>
          </div>
  
          <form onSubmit={onSubmitHandler} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Full Name</label>
              <input
                type="text"
                required
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#0d121f] border border-gray-700 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d121f] border border-gray-700 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">Password</label>
              <input
                type="password"
                required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d121f] border border-gray-700 rounded-lg py-2 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                placeholder="Create a strong password"
              />
            </div>
            <button 
            type="submit"
            className="w-full cursor-pointer mt-2 bg-linear-to-r from-[#00acee] to-[#0072ff] hover:brightness-110 text-white font-semibold py-2.5 rounded-lg shadow-[0_0_15px_rgba(0,172,238,0.2)] text-sm transition-all active:scale-[0.98]">
              Get Started Free
            </button>
            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 border-t border-gray-800"></div>
              <span className="relative px-2 bg-[#111827] text-xs text-gray-500 uppercase tracking-wider font-medium">Or</span>
            </div>
            <button 
            onClick={() => {
              window.location.href = //http://localhost:3000/auth/google
                import.meta.env.VITE_API_AUTH_URL + "/auth/google";
              }}
              // 1️⃣ Browser → Backend /auth/google
              // 2️⃣ Backend → Google OAuth page
              // 3️⃣ User logs in
              // 4️⃣ Google → Backend callback
              // 5️⃣ Backend sets cookie + redirects
              // 6️⃣ Backend → http://localhost:5173/boards
              className="w-full cursor-pointer flex items-center justify-center gap-2 bg-[#1f2937] hover:bg-[#2d3748] text-white font-medium py-2 rounded-lg border border-gray-700 transition-all text-sm"
              type="button">
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="w-4 h-4" alt="Google icon" />
              Sign up with Google
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-gray-500">
            Already have an account? 
            <a 
            onClick={()=> navigate('/login')}
            className="text-blue-400 cursor-pointer hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
