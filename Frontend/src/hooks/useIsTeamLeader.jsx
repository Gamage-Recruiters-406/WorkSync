import { useEffect, useState } from "react";
import axios from "axios";

const URL_API = "http://localhost:8090";

const getToken = () =>
  document.cookie
    .split(";")
    .find(c => c.trim().startsWith("access_token="))
    ?.split("=")[1] || null;

const useIsTeamLeader = (projectId) => {
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    console.log("useIsTeamLeader triggered. projectId:", projectId);
    const checkTeamLeader = async () => {
      try {
        console.log("checkTeamLeader started");
        if (!projectId) {
          console.log("❌ No projectId");
          return;
        }

        const token = getToken();
        console.log("Token:", token);
        if (!token) {
          console.log("❌ No token found");
          return;
        } 
        

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userid;
        setCurrentUserId(userId);
        console.log("Current user ID:", userId);

        const res = await axios.get(
          `${URL_API}/api/v1/projects/getProject/${projectId}`,
          { withCredentials: true }
        );
        console.log("Project API response:", res.data);
        const teamLeaderId = res.data?.data?.teamLeader?._id;
        console.log("Team Leader ID:", teamLeaderId);
        setIsTeamLeader(
          teamLeaderId && teamLeaderId.toString() === userId.toString()
        );
        if (!projectId || !token){
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("useIsTeamLeader error:", error);
        setIsTeamLeader(false);
      } finally {
        setLoading(false);
      }
      
    };
    

    checkTeamLeader();
  }, [projectId]);

  return { isTeamLeader, loading, currentUserId };
};

export default useIsTeamLeader;
