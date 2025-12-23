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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

        <form className="space-y-4" onSubmit={onSubmitHandler}>
          <input
            type="text"
            placeholder="Full name"
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
