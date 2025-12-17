import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    qualification: "",
    contactNumber: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // Reset messages
    setError("");
    setSuccess("");

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          role: 1, // Default role as Employee
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Unable to connect to server. Please try again.");
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
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 left-0 w-16 h-32 bg-gray-300 hidden md:block"></div>
      <div className="absolute top-0 left-0 w-52 h-80 bg-teal-600 rounded-br-[100px] hidden md:block"></div>
      <div className="absolute bottom-0 left-0 w-72 h-96 bg-teal-600 rounded-tr-[150px] hidden md:block"></div>
      <div className="absolute bottom-36 left-32 w-32 h-32 bg-gray-300 rounded-full hidden lg:block"></div>
      <div className="absolute top-0 right-0 w-64 h-72 bg-teal-600 rounded-bl-[120px] hidden md:block"></div>
      <div className="absolute top-16 right-48 w-40 h-40 bg-gray-300 rounded-half hidden lg:block"></div>
      <div className="absolute bottom-0 right-0 w-24 h-40 bg-gray-300 hidden md:block"></div>

      {/* Card wrapper */}
      <div className="relative z-10 flex w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* LEFT BRAND SECTION */}
        <div className="hidden md:flex md:w-2/5 bg-gradient-to-b from-teal-500 to-teal-[#087990] items-center justify-center relative p-12">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gray-300 bg-opacity-30 rounded-br-full"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white bg-opacity-10 rounded-tr-[80px]"></div>
          
          <div className="text-center relative z-10">
            <div className="mb-8 flex justify-center">
              <div className="relative">
              
              </div>
            </div>
            
            <h1 className="text-white text-4xl font-light tracking-wide">Work Sync</h1>
          </div>
        </div>

        {/* RIGHT SIGNUP SECTION */}
        <div className="w-full md:w-3/5 p-6 sm:p-8 lg:p-10 flex items-center justify-center">
          <div className="w-full max-w-xl">
            <h2 className="text-2xl font-semibold text-teal-700 text-center mb-1">
              Sign Up
            </h2>
            <p className="text-center text-gray-500 text-sm mb-6">
              Manage smart. Work better.
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
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Qualification */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="BSc in Engineering"
                  value={formData.qualification}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>

              {/* Contact Number and Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="+94 77 123 1234"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Male</option>
            
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <p className="text-xs text-gray-500 mb-1">
                  This will function as your username
                </p>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="samia@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
              </div>

              {/* Password and Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="········"
                    value={formData.password}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="········"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Create Account Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2.5 rounded-md transition-colors font-medium disabled:bg-teal-400 disabled:cursor-not-allowed mt-2"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>

              {/* Already have an account */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{" "}
                <button
                  onClick={() => navigate("/login")}
                  className="text-teal-600 hover:text-teal-700 font-medium bg-transparent border-0 cursor-pointer"
                >
                  Log In
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}