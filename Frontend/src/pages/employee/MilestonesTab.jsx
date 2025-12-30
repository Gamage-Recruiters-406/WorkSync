import { useEffect, useState } from "react";
import AddMilestoneModal from "./AddMilestoneModal";
import MilestoneDetailsModal from "./MilestoneDetailsModal";
import axios from "axios";
import EditMilestoneModal from "./EditMilestoneModal";



const MilestonesTab = ({projectId, projectData}) => {
  const projectRole = projectData?.role || projectData?.assignedRole;
  const [milestones, setMilestones] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [loading, setLoading] = useState(true);

  const URL_API = "http://localhost:8090";

  const fetchMilestones = async () => {
    try {
      const res = await axios.get(`${URL_API}/api/v1/millestone/getAllMilestones/${projectId}`,
      {withCredentials: true}
      );

      const fetched = res.data.data.map(m => ({
        id: m._id,
        title: m.milestoneName,
        description: m.Description,
        startDate: m.Start_Date,
        endDate: m.End_Date,
        status: m.Status,
      }));
      setMilestones(fetched);
      console.log("FetchedMilestones:",res);
    } catch (error) {
      console.error("Failed to fetch milestones", error);
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if (projectId) fetchMilestones();
  }, [projectId]);

  const handleCreateMilestone = async (data) => {
    try {

      const payload = {
        projectID: projectId,                // pass the current project ID
        milestoneName: data.title,
        Description: data.description,
        Start_Date: data.startDate,
        End_Date: data.endDate,
        Status: data.status
      };

      const res = await axios.post(
        `${URL_API}/api/v1/millestone/createMilestone`,
        payload,
        {withCredentials: true}
      );

      const newMilestone = res.data.data;

      setMilestones((prev)=> [
        ...prev,
        {
          id: newMilestone._id,
          title: newMilestone.milestoneName,
          description: newMilestone.Description,
          startDate: newMilestone.Start_Date,
          endDate: newMilestone.End_Date,
          status: newMilestone.Status
        }
      
      ]);
      setIsAddOpen(false);
    } catch (error) {
      console.error("Failed to create milestone", error);
      alert("Failed to create milestone");
    } 
  };

  const handleDeleteMilestone = async (id)=> {
    if (!confirm("Are you sure you want to delete this milestone?")) return;

    try {
      await axios.delete(`${URL_API}/api/v1/millestone/deleteMilestone/${id}`, { withCredentials: true });
      setMilestones(prev => prev.filter(m => m.id !== id));
      alert("Milestone deleted successfully");
    } catch (error) {
      console.error("Failed to delete milestone", error);
      alert("Failed to delete milestone");
    }
  };

  const handleEditMilestone = async (updatedData) => {
    const res = await axios.put(
      `${URL_API}/api/v1/millestone/updateMilestone/${updatedData.id}`,
      updatedData,
      { withCredentials: true }
    );
  
    const updated = res.data.data;
  
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === updated._id
          ? {
              id: updated._id,
              title: updated.milestoneName,
              description: updated.Description,
              startDate: updated.Start_Date,
              endDate: updated.End_Date,
              status: updated.Status,
            }
          : m
      )
    );
  
    setIsEditOpen(false);
    setSelectedMilestone(null);
  };

  const openDetails = (milestone) => {
    setSelectedMilestone(milestone);
  };

  const closeDetails = () => {
    setSelectedMilestone(null);
  };

  const openEdit = (milestone) =>{
    setSelectedMilestone(milestone);
    setIsEditOpen(true);
  };

  

  const isTeamLeader = projectRole === "Team Leader";

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-center flex-1">
          Milestones
        </h2>

        {isTeamLeader && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-2 mr-6 rounded-md bg-[#087990] text-white text-sm hover:bg-teal-900"
          >
            Add Milestone
          </button>
        )}
      </div>

      {loading && (
        <p className="m-6 text-gray-500">Loading milestones...</p>
      )}

      {!loading && milestones.length === 0 && (
        <p className="m-6 text-gray-500">No milestones found.</p>
      )}

      {/* milestone cards */}
      <div className="space-y-6 max-w-xl m-6">
        {milestones.length === 0 ? (
          <p className="text-gray-500 text-center">
            No milestones created yet.
          </p>
        ) :(
        milestones.map((m) => (
          <div
            key={m.id}
            className="border border-[#087990] bg-white rounded-md shadow-sm text-sm text-gray-700"
          >
            <div className="px-4 py-2 border-b flex justify-between items-center">
              <p className="font-semibold text-base">{m.title}</p>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Start Date:</span>{" "}
                  {new Date(m.startDate).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">End Date:</span>{" "}
                  {new Date(m.endDate).toLocaleDateString()}
                </p>
                
              </div>
              <button
                onClick={() => openDetails(m)}
                className="px-5 py-2 rounded-md bg-[#087990] text-white text-sm hover:bg-teal-900"
              >
                View Details
              </button>

              {isTeamLeader && (
                <>
                <button
                  onClick={() => openEdit(m)}
                  className="px-4 py-2 rounded-md bg-yellow-600 text-white text-sm hover:bg-yellow-700"
                >
                  Edit
                </button>
        
                <button
                  onClick={() => handleDeleteMilestone(m.id)}
                  className="px-4 py-2 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </>
              )}
            </div>
          </div>
          ))
        )}
      </div>

      {isAddOpen && (
        <AddMilestoneModal
          onClose={() => setIsAddOpen(false)}
          onCreate={handleCreateMilestone}
        />
      )}

      {isEditOpen && selectedMilestone && (
        <EditMilestoneModal
          milestone={selectedMilestone}
          onClose={() => setIsEditOpen(false)}
          onUpdate={handleEditMilestone}
        />
      )}

      {selectedMilestone && (
        <MilestoneDetailsModal
          milestone={selectedMilestone}
          onClose={closeDetails}
          onUpdate={(updatedMilestone) =>{
            setMilestones((prev)=>
             prev.map((m)=>
              m.id === updatedMilestone._id
                ? {
                  ...m,
                  title: updatedMilestone.milestoneName,
                  description: updatedMilestone.Description,
                  startDate: updatedMilestone.Start_Date,
                  endDate: updatedMilestone.End_Date,
                  status: updatedMilestone.Status
                }
                : m
              )
            );
            setSelectedMilestone((prev) => ({
              ...prev,
              status: updatedMilestone.Status
            }));
          }}
        />
      )}
    </>
  );
};

export default MilestonesTab;
