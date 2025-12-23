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
      await login({ email, password });
      navigate('/boards')
    } catch (error) {
      throw error; 
    }
    finally{
      setLoading(false);
    }
  };


  return ( //  Render login UI
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        {/* Error message placeholder */}
        <div className="text-red-500 text-sm mb-4">
          {/* error message goes here */}
        </div>

        <form className="space-y-4" onSubmit={onSubmitHandler}>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Login</button>
        </form>

        <div className="flex items-center my-4">
          <div className="grow h-px bg-gray-300" />
          <span className="px-2 text-sm text-gray-500">OR</span>
          <div className="grow h-px bg-gray-300" />
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
        className="w-full border py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50">
        </button>

        {/* Signup redirect */}
        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <span 
          onClick={() => navigate("/signup")}
          className="text-blue-600 cursor-pointer">Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
