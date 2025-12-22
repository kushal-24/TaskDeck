import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
    const[fullName, setFullName]=useState("");
    const[email,setEmail]=useState("");
    const[password, setPassword]= useState("");
    const[loading,setLoading]=useState(false)

    const navigate= useNavigate();
    const onSubmitHandler=async(e)=>{
        e.preventDefault();

        if (!fullName || !email || !password) {
            console.log("All fields are required");
            return;
        }

        try {
            const res= await axios.post("/api/v1/user/signup", {fullName, email, password}, {withCredentials:true});
            console.log("Login success:", res.data);
            // login(user);
            navigate("/login");

        } catch (error) {
            console.log("signup error:", error.response?.data?.message);
        }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        {/* Error placeholder */}
        <div className="text-red-500 text-sm mb-4">
          {/* error message here */}
        </div>

        {/* Signup Form */}
        <form className="space-y-4"
        onSubmit={onSubmitHandler}
        >
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
            onChange={(e)=>{setFullName(e.target.value)}}
              type="text"
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
            onChange={(e)=>{setEmail(e.target.value)}}
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
            onChange={(e)=>{setPassword(e.target.value)}}
              type="password"
              placeholder="Create a password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700">
            Sign Up
          </button>
        </form>

        {/* Login redirect */}
        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span className="text-blue-600 cursor-pointer">Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
