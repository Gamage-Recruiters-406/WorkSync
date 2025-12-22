import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
// import OverviewTab from "./OverviewTab";
// import DocumentsTab from "./DocumentsTab";
// import MilestonesTab from "./MilestonesTab";

const TABS = ["overview", "Team", "milestones", "documents"];

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [projectData, setProjectData] = useState(location.state?.project || null);
  const [loading, setLoading] = useState(!projectData);

  const URL_API = "http://localhost:8090";

  // dummy data – replace with real project data (fetched by id)
  useEffect(()=>{
    if (!projectData && id) {
      const fetchProject = async ()=>{
        try {
          const res = await axios.get(`${URL_API}/api/v1/project-team/getProject/${id}`, {
            withCredentials: true,
          });
          setProjectData(res.data.data);
        } catch (error) {
          console.error("Error fetching project details:", error);
          setProjectData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
    
  },[projectData, id]);


  const goBack = () => navigate("/user/project-team"); // back to projects page

  const statusColor = {
    Active: "bg-green-500",
    "On Hold": "bg-orange-500",
    Completed: "bg-red-500",
  };

  if (loading) return <p className="p-6 text-center">Loading project details...</p>;
  if (!projectData) return <p className="p-6 text-center">Project data not found.</p>;

  return (
    <div className="flex h-screen">
      {/* side bar */}
      <Sidebar/>
      <main className="flex-1 p-6 bg-gray-100">
        <div className="flex items-center justify-between m-4">
          <button
            onClick={goBack}
            className="px-6 py-2 border border-[#087990] text-[#087990] rounded-md hover:bg-[#087990]/50"
          >
            Back
          </button>

          <div className="text-center">
            <h1 className="text-xl font-semibold">{projectData.name}</h1>
          </div>

          <div className="text-right text-sm">
            <p>
              Role : <span className="font-medium">{projectData.role || projectData.assignedRole}</span>
            </p>
            <p>
              Deadline: <span className="font-medium">{projectData.deadline || "-"}</span>
            </p>
          </div>
        </div>

      {/* Status row */}
        <div className="flex items-center justify-between border-b pb-3 mb-4 ml-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium">Status :</span>
            <span className={`w-3 h-3 rounded-full ${statusColor[projectData.status || "Active"]}`}></span>
            <span>{projectData.status || "Active"}</span>
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
        {/* {activeTab === "overview" && (
          <OverviewTab project={project} />
        )}

        {activeTab === "milestones" && (
          <MilestonesTab project={project} />
        )}

        {activeTab === "documents" && (
          <DocumentsTab project={project} />
        )} */}
      </main>
    </div>
  );
};

export default ProjectDetails;
