import { useEffect, useState } from "react";
import axios from "axios";
import ProjectCard from "./components/ProjectCard";
import TopBar from "./components/Topbar";


const ProjectsPage = () => {
    const currentUser = { name: "Jeyson" }; // example user
    const [projects, setProjects] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");

    const [loading, setLoading] = useState(true);
    const URL_API = "http://localhost:8090";

    useEffect(()=>{
      //Fetch projects
      axios.get(
        `${URL_API}/api/v1/projects/getAllProjects`,
        {
          withCredentials:true
        }
        
        ) // need to replace with API route

      .then((res)=>{
        setProjects(res.data);
        setLoading(false);
      })
      .catch((err)=>{
        console.error("Error fetching projects", err);
        setLoading(false);
      });
    },[]);

    const filteredProjects = projects.filter((project) =>{
        const statusMatch = statusFilter ==="all" || project.status === statusFilter;
        return statusMatch;
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


      <div className="flex flex-wrap justify-start gap-4 mb-6 ml-8 mx-auto">

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
        {loading ? (
          <p className="text-center col-span-2">Loading projects...</p>
        ): filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
                <ProjectCard key={project._id} project={project} />
              ))
        ): (<p className="text-center text-gray-500 col-span-2">No projects found.</p>)}
        
      </div>
    </div>
  );
};

export default ProjectsPage;
