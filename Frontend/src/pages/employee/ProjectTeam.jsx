import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";

const ProjectTeam = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Project Team</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Welcome to the project team page!</p>
        </div>
      </main>
    </div>
  );
};

export default ProjectTeam;
