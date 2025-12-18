import { useEffect, useState } from "react";
import KpiCards from "../../components/reportAnalytics/kpi/KpiCards";
import AttendanceBarChart from "../../components/reportAnalytics/charts/AttendanceBarChart";
import LeaveDonutChart from "../../components/reportAnalytics/charts/LeaveDonutChart";
import TaskDonutChart from "../../components/reportAnalytics/charts/TaskDonutChart";

import AttendanceTable from "../../components/reportAnalytics/tables/AttendanceTable";
import TaskTable from "../../components/reportAnalytics/tables/TaskTable";
import ProjectTable from "../../components/reportAnalytics/tables/ProjectTable";

import Sidebar from "../../components/sidebar/Sidebar";
import {
  getAttendance,
  getAttendanceReport,
  getAllLeaves,
  getTaskReport,
  getAllTasks,
  getAllProjects,
} from "../../services/adminReportsApi";

export default function AdminReport() {
  // KPI State
  const [kpis, setKpis] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absentToday: 0,
    pendingLeaves: 0,
  });

  // Chart Data State
  const [chartData, setChartData] = useState({
    attendance: [],
    leaves: [],
    tasks: [],
  });

  // Tables State
  const [attendanceData, setAttendanceData] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [projectData, setProjectData] = useState([]);

  // --- Load KPI Data ---
  useEffect(() => {
    const loadKpis = async () => {
      try {
        const [attendanceRes, leaveRes] = await Promise.all([
          getAttendance(),
          getAllLeaves(),
        ]);

        const attendance = attendanceRes?.data?.attendance || [];

        const leaves = Array.isArray(leaveRes?.data)
          ? leaveRes.data
          : leaveRes?.data?.leaves || [];

        setKpis((prev) => ({
          ...prev,
          presentToday: attendance.filter((a) => a.status === "Present").length,
          absentToday: attendance.filter((a) => a.status === "Absent").length,
          pendingLeaves: leaves.filter((l) => l.status === "Pending").length,
        }));
      } catch (error) {
        console.error("❌ Error loading KPI data:", error);
      }
    };

    loadKpis();
  }, []);

  // --- Load Chart Data ---
  useEffect(() => {
    const loadCharts = async () => {
      try {
        const [attendanceReportRes, leavesRes, taskReportRes] =
          await Promise.all([
            getAttendanceReport(),
            getAllLeaves(),
            getTaskReport(),
          ]);

        const attendance = attendanceReportRes?.data?.attendance || [];

        const leaves = Array.isArray(leavesRes?.data)
          ? leavesRes.data
          : leavesRes?.data?.leaves || [];

        const tasks = Array.isArray(taskReportRes?.data)
          ? taskReportRes.data
          : taskReportRes?.data?.tasks || [];

        setChartData({
          attendance,
          leaves,
          tasks,
        });
      } catch (error) {
        console.error("❌ Error loading chart data:", error);
      }
    };

    loadCharts();
  }, []);

  // --- Load Tables Data ---
  useEffect(() => {
    const loadTables = async () => {
      try {
        const [attendanceRes, tasksRes, projectsRes] = await Promise.all([
          getAttendance(),
          getAllTasks(),
          getAllProjects(),
        ]);

        const attendance = attendanceRes?.data?.attendance || [];

        const tasks = Array.isArray(tasksRes?.data)
          ? tasksRes.data
          : tasksRes?.data?.tasks || [];

        const projects = Array.isArray(projectsRes?.data)
          ? projectsRes.data
          : projectsRes?.data?.projects || [];

        setAttendanceData(attendance);
        setTaskData(tasks);
        setProjectData(projects);
      } catch (error) {
        console.error("❌ Error loading tables:", error);
      }
    };

    loadTables();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Reports</h1>
        <div className="flex-1 p-6 overflow-y-auto space-y-8 p-">
          {/* KPI GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCards title="Total Employees" value={kpis.totalEmployees} />
            <KpiCards title="Present Today" value={kpis.presentToday} />
            <KpiCards title="Absent Today" value={kpis.absentToday} />
            <KpiCards title="Pending Leaves" value={kpis.pendingLeaves} />
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AttendanceBarChart data={chartData.attendance} />
            <LeaveDonutChart data={chartData.leaves} />
            <TaskDonutChart data={chartData.tasks} />
          </div>

          {/* TABLES */}
          <AttendanceTable data={attendanceData} />
          <TaskTable data={taskData} />
          <ProjectTable data={projectData} />
        </div>
      </main>
    </div>
  );
}
