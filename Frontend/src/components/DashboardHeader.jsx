import React from "react";
import { Search, Bell } from "lucide-react";

const DashboardHeader = ({ user, role }) => {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087990] w-80"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="relative cursor-pointer">
            <Bell className="w-5 h-5 text-[#087990]" />
            <div className="absolute -top-0.5 right-0 w-2.5 h-2.5 rounded-full bg-[#087990]" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-gray-700">
              {user?.name}
            </span>
            <span className="text-xs text-gray-500">{role || ""}</span>
          </div>
          <div className="w-9 h-9  rounded-full">
            <img
              src={
                user?.image ||
                "https://img.freepik.com/premium-vector/vector-flat-illustration-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette-profile-picture-suitable-social-media-profiles-icons-screensavers-as-templatex9xa_719432-2205.jpg"
              }
              alt={`${user?.name.charAt(0)}`}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
