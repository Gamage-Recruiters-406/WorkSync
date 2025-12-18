import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< Updated upstream
=======
import LogoImg from "../assets/Logo.jpg";
import axios from "axios";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
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
=======
    //   const response = await fetch("http://localhost:8090/api/v1/userAuth/userLogin", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     credentials: "include",
    //     body: JSON.stringify({ email, password }),
    //   });
    const res = await axios.post("http://localhost:8090/api/v1/userAuth/userLogin", { email, password });
    console.log(res);

    //   const data = await response.json();

      if (res.data.success) {
        setSuccess("Login successful!");

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data));

        setTimeout(() => {
          if (res.data.data.role === 3) {
            navigate("/admin/dashboard");
          } else if (res.data.data.role === 2) {
>>>>>>> Stashed changes
            navigate("/manager/dashboard");
          } else {
            navigate("/employee/dashboard");
          }
        }, 1000);
      } else {
<<<<<<< Updated upstream
        setError(data.message || "Login failed");
=======
        setError(res.data.message || "Login failed");
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 left-0 w-16 h-32 bg-gray-300 hidden md:block"></div>
      <div className="absolute top-0 left-0 w-52 h-80 bg-teal-600 rounded-br-[100px] hidden md:block"></div>
      <div className="absolute bottom-0 left-0 w-72 h-96 bg-teal-600 rounded-tr-[150px] hidden md:block"></div>
      <div className="absolute bottom-36 left-32 w-32 h-32 bg-gray-300 rounded-full hidden lg:block"></div>
      <div className="absolute top-0 right-0 w-64 h-72 bg-teal-600 rounded-bl-[120px] hidden md:block"></div>
      <div className="absolute top-16 right-48 w-40 h-40 bg-gray-300 rounded-full hidden lg:block"></div>
      <div className="absolute bottom-0 right-0 w-24 h-40 bg-gray-300 hidden md:block"></div>
=======
<div className="min-h-screen w-full bg-white flex items-center justify-center px-4 relative overflow-hidden">
  {/* Background Decorative Shapes */}
  <div className="absolute inset-0 z-0">
    {/* Top Right Corner */}
    <div className="absolute top-0 right-0 w-72 h-72 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem]  bg-[#E5E7EB] rounded-bl-[160px]"></div>
    <div className="absolute top-0 right-0 w-56 h-56  md:w-72 md:h-72 lg:w-[22rem] lg:h-[22rem] bg-[#087990] rounded-bl-[120px]"></div>

    {/* Bottom Left Corner */}
    <div className="absolute bottom-0 left-0 w-72 h-72 md:w-96 md:h-96  lg:w-[28rem] lg:h-[28rem] bg-[#E5E7EB] rounded-tr-[160px]"></div>
    <div className="absolute bottom-0 left-0 w-56 h-56 md:w-72 md:h-72 lg:w-[22rem] lg:h-[22rem] bg-[#087990] rounded-tr-[120px]"> </div></div>
>>>>>>> Stashed changes

      {/* Card wrapper */}
      <div className="relative z-10 flex w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* LEFT BRAND SECTION */}
<<<<<<< Updated upstream
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
=======
        <div className="hidden md:flex md:w-1/2 bg-[#087990] items-center justify-center relative p-12">
          <div className="absolute top-0 left-0 w-32 h-32 bg-[#E5E7EB] bg-opacity-20 rounded-br-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white bg-opacity-10 rounded-tr-[80px]"></div>

          <div className="text-center relative z-10">
            {/* Logo Container */}
            <div className="mb-8 flex justify-center">
              <div className="w-40 h-40 bg-white rounded-2xl shadow-lg flex items-center justify-center p-4">
                <img
                  src={LogoImg}
                  alt="Work Sync Logo"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
            </div>

            <h1 className="text-white text-4xl font-light tracking-wide mb-2">
              Work Sync
            </h1>
            <p className="text-white text-sm opacity-90">
              Workforce  Management System
            </p>
>>>>>>> Stashed changes
          </div>
        </div>

        {/* RIGHT LOGIN SECTION */}
<<<<<<< Updated upstream
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-teal-700 text-center mb-2">
              Sign In
            </h2>
            <p className="text-center text-gray-500 text-sm mb-8">
=======
        <div className="w-full md:w-1/2 p-6 sm:p-8 lg:p-12 flex items-center justify-center bg-white">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-semibold text-[#087990] text-center mb-2">
              Sign In
            </h2>
            <p className="text-center text-gray-600 text-sm mb-8">
>>>>>>> Stashed changes
              Welcome back! Please log in to your account.
            </p>

            {/* Error Message */}
            {error && (
<<<<<<< Updated upstream
              <div className="mb-4 text-sm text-red-700 bg-red-100 border border-red-400 p-3 rounded">
=======
              <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-300 p-3 rounded-lg">
>>>>>>> Stashed changes
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
<<<<<<< Updated upstream
              <div className="mb-4 text-sm text-green-700 bg-green-100 border border-green-400 p-3 rounded">
=======
              <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-300 p-3 rounded-lg">
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
=======
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087990] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
=======
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087990] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
>>>>>>> Stashed changes
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>

              <div className="text-right">
<<<<<<< Updated upstream
                <button className="text-sm text-teal-600 hover:text-teal-700 hover:underline bg-transparent border-0 cursor-pointer">
=======
                <button className="text-sm text-[#087990] hover:text-[#065f72] hover:underline bg-transparent border-0 cursor-pointer transition-colors">
>>>>>>> Stashed changes
                  Forgot Password?
                </button>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
<<<<<<< Updated upstream
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-md transition-colors font-medium disabled:bg-teal-400 disabled:cursor-not-allowed"
=======
                className="w-full bg-[#087990] hover:bg-[#065f72] text-white py-3 rounded-lg transition-all font-medium disabled:bg-[#087990] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
>>>>>>> Stashed changes
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>

              <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?{" "}
                <button
                  onClick={() => navigate("/signup")}
<<<<<<< Updated upstream
                  className="text-teal-600 hover:text-teal-700 font-medium bg-transparent border-0 cursor-pointer"
=======
                  className="text-[#087990] hover:text-[#065f72] font-medium bg-transparent border-0 cursor-pointer transition-colors"
>>>>>>> Stashed changes
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