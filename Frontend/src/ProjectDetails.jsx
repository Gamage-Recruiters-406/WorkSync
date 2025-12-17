import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import TopBar from "./components/Topbar";
import OverviewTab from "./OverviewTab";

const TABS = ["overview", "milestones", "documents"];

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    axios.get(`http://localhost:8090/projects/${id}`)
    .then((res)=>{
      setProject(res.data);
      setLoading(false);
    })
    .catch((err)=>{
      console.error("Error fetching project", err);
      setLoading(false);
    });
  },[id]);

  if (loading) {
    return <p className="text-center mt-10">Loading project...</p>;
  }
  if (!project) {
    return <p className="text-center mt-10">Project not found</p>;
  }



  const goBack = () => navigate("/Projects"); // back to projects page

  const statusColor = {
    Active: "bg-green-500",
    "On Hold": "bg-orange-500",
    Completed: "bg-red-500",
  };

  return (
    <div className="w-full bg-white">
      {/* Top bar */}
      <TopBar/>
      <div className="flex items-center justify-between m-4">
        <button
          onClick={goBack}
          className="px-6 py-2 border border-[#087990] text-[#087990] rounded-md hover:bg-[#087990]/50"
        >
          Back
        </button>

        <div className="text-center">
          <h1 className="text-xl font-semibold">{project.name}</h1>
        </div>

        <div className="text-right text-sm">
          <p>
            Role : <span className="font-medium">{project.role}</span>
          </p>
          <p>
            Deadline: <span className="font-medium">{project.deadline}</span>
          </p>
        </div>
      </div>

      {/* Status row */}
      <div className="flex items-center justify-between border-b pb-3 mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">Status :</span>
          <span className={`w-3 h-3 rounded-full ${statusColor[project.status]}`}></span>
          <span className="capitalize">{project.status}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          const label =
            tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ");
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-medium border ${
                isActive
                  ? "bg-[#087990] text-white border-[#087990]"
                  : "bg-white text-[#087990] border-[#087990]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <OverviewTab project={project} />
      )}

      {/* {activeTab === "milestones" && (
        <MilestonesTab project={project} />
      )}

      {activeTab === "documents" && (
        <DocumentsTab project={project} />
      )} */}
    </div>
  );
};

export default ProjectDetails;
