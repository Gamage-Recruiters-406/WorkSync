import { useState } from "react";
import ProjectCard from "./components/ProjectCard";
import TopBar from "./components/Topbar";


// Dummy data for checking
const dummyProjects = [
  {
    id: 1,
    name: "Project Card",
    role: "Developer",
    milestonesDueSoon: 2,
    tasksAssigned: 5,
    progress: 70,
    deadline: "20/01/2026",
    status: "on-hold", // orange
  },
  {
    id: 2,
    name: "Project Card",
    role: "Developer",
    milestonesDueSoon: 2,
    tasksAssigned: 5,
    progress: 40,
    deadline: "15/02/2026",
    status: "on-hold",
  },
  {
    id: 3,
    name: "Project Card",
    role: "Developer",
    milestonesDueSoon: 2,
    tasksAssigned: 5,
    progress: 15,
    deadline: "05/03/2026",
    status: "on-hold",
  },
  {
    id: 4,
    name: "Project Card",
    role: "Developer",
    milestonesDueSoon: 2,
    tasksAssigned: 5,
    progress: 85,
    deadline: "10/04/2026",
    status: "active", 
  },
  {
    id: 5,
    name: "Project Card",
    role: "Developer",
    milestonesDueSoon: 2,
    tasksAssigned: 5,
    progress: 100,
    deadline: "20/01/2026",
    status: "completed", // orange
  }
];

const ProjectsPage = () => {
    const currentUser = { name: "Jeyson" }; // example user
    const [statusFilter, setStatusFilter] = useState("all");
    const [projectFilter, setProjectFilter] = useState("all");

    const filteredProjects = dummyProjects.filter((project) =>{
        const statusMatch = statusFilter ==="all" || project.status === statusFilter;
        const projectMatch = projectFilter === "all" || projectFilter === "my-projects";
        return statusMatch && projectMatch;
    });

  return (
    <div className="w-full min-h-screen bg-white">
        <TopBar user = {currentUser}/>
      <header className="mb-6 mt-6">
        <h1 className="text-2xl font-semibold text-center">My Projects</h1>
        <p className="text-center font-semibold">
          Welcome back, {currentUser.name}
        </p>
      </header>

      <div className="flex flex-wrap justify-left gap-4 mb-6 ml-8 mx-auto">
        {/* All Projects Dropdown */}
        <div className="relative w-34">
            <select 
            value={projectFilter}
            onChange={(e)=> setProjectFilter(e.target.value)}
             className="w-full px-3 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#087990]">
            <option value="all">All</option>
            <option value="my-projects">My Projects</option>
            <option value="team-projects">Team Projects</option>
            </select>
        </div>

        {/* Status Dropdown */}
        <div className="relative w-34">
            <select
            value={statusFilter}
            onChange={(e)=> setStatusFilter(e.target.value)}
             className="w-full px-3 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#087990]">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            </select>
        </div>
      </div>

        {/* Display Project cards*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16 max-w-3xl mx-auto">
        {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
        ): (<p className="text-center text-gray-500 col-span-2">No projects found.</p>)}
        
      </div>
    </div>
  );
};

export default ProjectsPage;
