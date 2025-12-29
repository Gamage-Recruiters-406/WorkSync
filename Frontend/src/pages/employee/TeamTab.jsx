import { useEffect, useState } from "react";
import AddMemberModal from "./AddMemberModal";
import axios from "axios";

// example – replace with auth/context user
// const currentUser = {
//   id: 1,
//   name: "Team Lead",
//   role: "team-leader", // or "member"
// };


const URL_API = "http://localhost:8090";

const TeamTab = ({projectId, projectData}) => {
    const projectRole = projectData?.role || projectData?.assignedRole;
  const [team, setTeam] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);  // All user for Dropdown

  const isTeamLeader = projectRole === "Team Leader";
//   const isTeamLeader = currentUser.role === "team-leader";

  // Fetch current team members
  const fetchMembers = async ()=>{
    try {
      const res = await axios.get(`${URL_API}/api/v1/project-team/getMembers/${projectId}`,{
        withCredentials: true,
      });
      setTeam(res.data.data || []);
      console.log("Members: ", res);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
    }
  };

  useEffect(()=>{
    fetchMembers();
  },[projectId]);

  // Fetech all users for AddMemberModel
  useEffect(()=>{
    const fetchUser = async ()=>{
      try {
        const res = await axios.get(`${URL_API}/api/v1/project-team/all`,{withCredentials: true});
        setUsers(res.data.data || []);
        
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUser();
  },[]);

  //Add Member
  const handleAddMember = async (member) => {
    try {
      await axios.post(
        `${URL_API}/api/v1/project-team/addMember`,
        {projectId, userId:member.id, assignedRole: member.role},
        { withCredentials: true}
      );
      fetchMembers();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add member:", error);
    }
    
  };

  // Remove member
  const handleRemove = async (id) => {
    try {
      await axios.delete(`${URL_API}/api/v1/project-team/removeMember`,{
        data: {projectId, userId:id},
        withCredentials: true,
      });
      fetchMembers();
    } catch (error) {
      console.error("Failed to remove member:", error);
    }
    
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold ml-6">Project Team</h2>

        {isTeamLeader && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 rounded-md bg-[#087990] text-white text-sm hover:bg-teal-900 m-6"
          >
            + Add Members
          </button>
        )}
      </div>

      <div className="bg-white border rounded-md shadow-sm max-w-4xl m-6">
        <div className="px-6 py-3 border-b font-semibold text-sm">
          <div className="grid grid-cols-3">
            <span className="text-center">Name</span>
            <span className="text-center">Role</span>
          </div>
        </div>

        {team.map((member) => (
          <div
            key={member._id}
            className="py-3 border-t text-sm flex items-center"
          >
            <div className="w-1/6" />
            <div className="w-1/3 font-medium">
                {member.userId?.name || member.userId?.email || "Unknown"}
            </div>
            <div className="w-1/3 flex items-center justify-between">
              <span>{member.assignedRole}</span>

              {isTeamLeader && (
                <button
                  onClick={() => handleRemove(member.userId.id)}
                  className="ml-4 px-4 py-1 rounded-md bg-red-500 text-white text-xs hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AddMemberModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddMember}
          
        />
      )}
    </>
  );
};

export default TeamTab;
