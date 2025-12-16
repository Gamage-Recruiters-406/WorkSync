import React from "react";


const TopBar = ({ user }) => {
  return (
    <div className="w-full bg-white  shadow-md flex items-center justify-between px-6 py-3">
      {/* Search Bar */}
      <div className="flex items-center w-full md:w-1/3">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-gray-200 pl-10 pr-4 py-1 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#087990] placeholder-[#087990]"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">&#128269;</span>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-3">
        <span className="text-gray-700 font-medium">{user?.name || "Guest"}</span>
        <span className="text-gray-500 text-2xl">&#128100;</span>
      </div>
    </div>
  );
};

export default TopBar;
