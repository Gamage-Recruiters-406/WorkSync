import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    // Reset messages
    setError("");
    setSuccess("");

    // Validation
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/userAuth/userLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Login successful!");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.data));

        setTimeout(() => {
          if (data.data.role === 3) {
            navigate("/admin/dashboard");
          } else if (data.data.role === 2) {
            navigate("/manager/dashboard");
          } else {
            navigate("/employee/dashboard");
          }
        }, 1000);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Unable to connect to server. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 left-0 w-16 h-32 bg-gray-300 hidden md:block"></div>
      <div className="absolute top-0 left-0 w-52 h-80 bg-teal-600 rounded-br-[100px] hidden md:block"></div>
      <div className="absolute bottom-0 left-0 w-72 h-96 bg-teal-600 rounded-tr-[150px] hidden md:block"></div>
      <div className="absolute bottom-36 left-32 w-32 h-32 bg-gray-300 rounded-full hidden lg:block"></div>
      <div className="absolute top-0 right-0 w-64 h-72 bg-teal-600 rounded-bl-[120px] hidden md:block"></div>
      <div className="absolute top-16 right-48 w-40 h-40 bg-gray-300 rounded-full hidden lg:block"></div>
      <div className="absolute bottom-0 right-0 w-24 h-40 bg-gray-300 hidden md:block"></div>

      {/* Card wrapper */}
      <div className="relative z-10 flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* LEFT BRAND SECTION */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-teal-500 to-teal-300 items-center justify-center relative p-12">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gray-300 bg-opacity-30 rounded-br-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white bg-opacity-10 rounded-tr-[80px]"></div>

          <div className="text-center relative z-10">
            <div className="mb-8 flex justify-center">
              <div className="relative">
               
              </div>
            </div>

            <h1 className="text-white text-4xl font-light tracking-wide">
              Work Sync
            </h1>
          </div>
        </div>

        {/* RIGHT LOGIN SECTION */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-teal-700 text-center mb-2">
              Sign In
            </h2>
            <p className="text-center text-gray-500 text-sm mb-8">
              Welcome back! Please log in to your account.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-400 p-3 rounded">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-400 p-3 rounded">
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>

              <div className="text-right">
                <button className="text-sm text-teal-600 hover:text-teal-700 hover:underline bg-transparent border-0 cursor-pointer">
                  Forgot Password?
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-md transition-colors font-medium disabled:bg-teal-400 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
                  className="text-teal-600 hover:text-teal-700 font-medium bg-transparent border-0 cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}