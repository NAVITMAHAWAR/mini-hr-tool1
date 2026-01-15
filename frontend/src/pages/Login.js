import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

	  toast.success("Login successful!", {
      description: `Welcome back, ${res.data.user.name || "User"}!`,
      duration: 3000,
    });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
		toast.info("Redirecting to Admin Dashboard...", { duration: 2000 });
        navigate("/admin");
      } else {
		toast.info("Redirecting to Employee Dashboard...", { duration: 2000 });
        navigate("/employee");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
		toast.error("Login failed", {
			
      description: message,
      duration: 5000,          // थोड़ा ज्यादा समय दिखाने के लिए
      action: {
		  label: "Retry",
		  onClick: () => handleLogin(),   // retry button (optional)
		},
    });
	setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-700/70 to-indigo-700/70 px-8 py-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">
              Sign In
            </h2>
            <p className="mt-3 text-blue-100/90 text-base">
              Access your Employee / Admin Dashboard
            </p>
          </div>

          {/* Form Area */}
          <div className="p-8 md:p-10 space-y-6">
            {errorMsg && (
              <div className="bg-red-500/20 border-l-4 border-red-400 text-red-100 p-4 rounded-lg">
                {errorMsg}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                className="w-full px-5 py-3.5 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-indigo-400 focus:bg-white/25 focus:ring-2 focus:ring-indigo-400/30 transition-all duration-300"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3.5 bg-white/15 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:border-indigo-400 focus:bg-white/25 focus:ring-2 focus:ring-indigo-400/30 transition-all duration-300"
              />
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className={`
                w-full py-4 px-6 rounded-xl font-semibold text-lg
                bg-gradient-to-r from-indigo-600 to-purple-600
                hover:from-indigo-700 hover:to-purple-700
                text-white shadow-lg hover:shadow-2xl
                transition-all duration-300 transform hover:-translate-y-1
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
                flex items-center justify-center gap-3
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>

            {/* Extra Links (optional) */}
            <div className="text-center text-sm text-white/70 mt-4">
              <a
                href="/"
                className="hover:text-white hover:underline transition-colors"
              >
                Forgot password?
              </a>
              <span className="mx-4">|</span>
              <a
                href="/signup"
                className="hover:text-white hover:underline transition-colors"
              >
                Create an account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
