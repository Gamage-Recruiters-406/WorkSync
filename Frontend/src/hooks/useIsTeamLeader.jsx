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
    const checkTeamLeader = async () => {
      try {
        if (!projectId) return;

        const token = getToken();
        if (!token) return;

        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.userid;
        setCurrentUserId(userId);

        const res = await axios.get(
          `${URL_API}/api/v1/projects/getProject/${projectId}`,
          { withCredentials: true }
        );

        const teamLeaderId = res.data?.data?.teamLeader?._id;

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
