import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      if (!name || !email || !password) {
        toast.warning("Please fill all required fields", {
          description: "Name, email and password are mandatory",
        });
        return;
      }
      await axios.post("http://localhost:5000/api/users/register", {
        name,
        email,
        password,
        role,
      });
      toast.success("Registration successful!", {
        description: "Your account has been created. Please login now.",
        duration: 4000,
        action: {
          label: "Go to Login",
          onClick: () => navigate("/login"),
        },
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      let errorMessage = "Registration failed. Please try again.";
      if (err.response) {
        if (err.response.status === 409) {
          errorMessage = "Email is already registered.";
        } else if (err.response.status === 400) {
          errorMessage =
            err.response.data.message || "Invalid input. Check your details.";
        } else {
          errorMessage = err.response.data?.message || "Server error occurred.";
        }
      } else if (err.request) {
        errorMessage =
          "No response from server. Check your internet or backend is running?";
      }
      toast.error("Registration failed", {
        description: errorMessage,
        duration: 5000,
        action: {
          label: "Try Again",
          onClick: () => handleSignup(),
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 transform transition-all duration-300 hover:shadow-3xl">
        {/* Header with Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              ></path>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            Signup 
          </h2>
          <p className="text-gray-600 mt-2">
            Create your account to get started
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-400 bg-white"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-1"
        >
          Signup
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors duration-200"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
