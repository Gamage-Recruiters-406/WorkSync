import React from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import { useState, useEffect } from "react";
import KpiCards from "../../components/reportAnalytics/kpi/KpiCards";
import AttendanceTable from "../../components/reportAnalytics/tables/AttendanceTable";
import TaskTable from "../../components/reportAnalytics/tables/TaskTable";
import ProjectTable from "../../components/reportAnalytics/tables/ProjectTable";

export default function UserReports({ userId }) {
  const [kpis, setKpis] = useState({
    presentToday: 0,
    tasksPending: 0,
    leavesPending: 0,
  });
  const [attendanceData, setAttendanceData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [projectData, setProjectData] = useState([]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [attendanceRes, tasksRes, projectsRes] = await Promise.all([
          getUserAttendance(userId),
          getUserTasks(userId),
          getUserProjects(userId),
        ]);

        const attendance = attendanceRes?.data || [];
        const tasks = tasksRes?.data || [];
        const projects = projectsRes?.data || [];

        setAttendanceData(attendance);
        setTaskData(tasks);
        setProjectData(projects);

        setKpis({
          presentToday: attendance.filter((a) => a.status === "Present").length,
          tasksPending: tasks.filter((t) => t.status === "Pending").length,
          leavesPending: 0, // if user leave API exists
        });
      } catch (err) {
        console.error("Error loading user report:", err);
      }
    };

    loadUserData();
  }, [userId]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">User Report & Analytics</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <KpiCards title="Present Today" value={kpis.presentToday} />
          <KpiCards title="Pending Tasks" value={kpis.tasksPending} />
          <KpiCards title="Pending Leaves" value={kpis.leavesPending} />
        </div>

        <AttendanceTable data={attendanceData} />
        <TaskTable data={taskData} />
        <ProjectTable data={projectData} />
      </main>
    </div>
  );
}
