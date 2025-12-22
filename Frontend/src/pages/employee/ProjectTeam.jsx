import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import jwtDecode from "jwt-decode";
import ProjectCard from "../../components/reportAnalytics/charts/ProjectCard";

const ProjectTeam = () => {

    const [projects, setProjects] = useState([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);

    const URL_API = "http://localhost:8090";

    useEffect(()=>{

      const token = localStorage.getItem("token");

      if (!token){
        console.warn("No token found, cannot fetch projects.");
        setLoading(false);
        return;
      }

      let userId;
      try{
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);
        userId = decoded.userid;
        console.log(userId);

      } catch(err){
        console.warn("Failed to decode JWT:", err);
        setLoading(false);
        return;
      }


      if (!userId){
        console.warn("User ID missing in token.");
        setLoading(false);
        return;
      }
        
      //fetch projects
      fetchProjects(userId);

    },[]);

    const fetchProjects = async(userId) =>{
      //Fetch projects
      try {
        const res = await axios.get(  
          `${URL_API}/api/v1/project-team/getProjects/${userId}`,
          {
            withCredentials:true
          } ) ;

          const projectsArray = Array.isArray(res.data.data)
            ? res.data.data.map((p) => ({
                id: p.projectId._id,                      // for navigation
                name: p.projectId.name,
                role: p.assignedRole,            // maps to ProjectCard role
                description: p.projectId.description,
                progress: 0,                     // default if not in API
                deadline: "-",                   // default if not in API
                status: "active"                 // default if not in API
              }))
            : [];
      
        console.log("Full response:", res.data);
        setProjects(projectsArray);
        console.log("Mapped projects:", projectsArray);

      } catch (error) {
        console.error("Error fetching projects:", error.response?.data || error);
        setProjects([]);       
      } finally {
        setLoading(false);
      }
    }

    const filteredProjects = Array.isArray(projects)
  ? projects.filter((project) => {
      // example: filter by assignedRole
      return statusFilter === "all" || project.status === statusFilter;
    })
  : [];

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Project Team</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p>Welcome to the project team page!</p>
        </div>
        <div className="flex flex-wrap justify-start gap-4 mb-6 ml-8 mx-auto">

        {/* Status Dropdown */}
        <div className="relative w-34 m-6">
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
                <ProjectCard key={project.id} project={project} />
              ))
        ): (<p className="text-center text-gray-500 col-span-2">No projects found.</p>)}
        
      </div>

      </main>
    </div>
  );
};

export default ProjectTeam;
