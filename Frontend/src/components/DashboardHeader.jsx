import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <header
      className="fixed top-0 left-60 right-0 h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40"
      style={{ borderColor: '#D9E2EC' }}
    >
      {/* Left - Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            style={{ color: '#718096' }}
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none transition-all"
            style={{
              backgroundColor: '#F1F5F7',
              borderColor: '#D9E2EC',
              color: '#2D3748',
            }}
          />
        </div>
      </div>

      {/* Right - Notification & Profile */}
      <div className="flex items-center gap-6 ml-8">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} style={{ color: '#718096' }} />
          <span
            className="absolute top-1 right-1 w-2 h-2 rounded-full"
            style={{ backgroundColor: '#00C853' }}
          ></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-semibold">
            M
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium" style={{ color: '#2D3748' }}>
              Mahi
            </span>
            <span className="text-xs" style={{ color: '#718096' }}>
              Admin
            </span>
          </div>
          <ChevronDown size={16} style={{ color: '#718096' }} />
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
