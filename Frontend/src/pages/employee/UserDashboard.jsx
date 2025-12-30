import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";

const UserDashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          User Dashboard
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Welcome to the user dashboard!</p>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
