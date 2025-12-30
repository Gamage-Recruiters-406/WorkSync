import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ProjectTable({ data }) {
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Projects Report", 14, 20);

    // Map data into table rows
    const rows = data.map((proj, i) => [
      proj.name,
      proj.teamLeader?.name || "-",
      proj.status,
      proj.startDate ? new Date(proj.startDate).toLocaleDateString() : "-",
      proj.endDate ? new Date(proj.endDate).toLocaleDateString() : "-",
    ]);

    autoTable(doc, {
      head: [["Project Name", "Team Lead", "Status", "Start Date", "End Date"]],
      body: rows,
      startY: 30,
    });

    doc.save("projects_report.pdf");
  };

  const handleExportExcel = () => {
    const worksheetData = data.map((proj) => ({
      "Project Name": proj.name,
      "Team Lead": proj.teamLeader?.name || "-",
      Status: proj.status,
      "Start Date": proj.startDate
        ? new Date(proj.startDate).toLocaleDateString()
        : "-",
      "End Date": proj.endDate
        ? new Date(proj.endDate).toLocaleDateString()
        : "-",
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Projects Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "projects_report.xlsx");
  };

  /*export default function ProjectTable({ data }) {
  const handleExport = (type) => {
    window.open(`/api/v1/projects/export?type=${type}`, "_blank"); // make sure backend route exists
  };*/

  return (
    <div className="bg-white p-4 rounded-xl shadow mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Projects Report</h2>
        <div>
          <button
            //onClick={() => handleExport("pdf")}
            onClick={handleExportPDF}
            className="bg-[#087990] text-white px-4 py-2 rounded mr-2  hover:text-[#087990]  hover:bg-gray-200 transition"
          >
            Export PDF
          </button>
          <button
            // onClick={() => handleExport("excel")}
            onClick={handleExportExcel}
            className="bg-white text-[#087990] px-4 py-2 rounded border border-gray-400 hover:bg-[#087990]  hover:text-white hover:border-gray-300 transition"
          >
            Export Excel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto max-h-96 overflow-y-auto">
        <table className="min-w-full border-separate border-spacing-0 rounded-xl">
          <thead className="bg-gray-300 sticky top-0 z-20">
            <tr>
              <th className="px-4 py-3 border text-left">Project Name</th>
              <th className="px-4 py-3 border text-left">Team Lead</th>
              <th className="px-4 py-3 border text-left">Status</th>
              <th className="px-4 py-3 border text-left">Start Date</th>
              <th className="px-4 py-3 border text-left">End Date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((proj, i) => (
              <tr
                key={i}
                className={`text-center ${
                  i % 2 === 0 ? "bg-blue-50" : "bg-blue-100"
                }`}
              >
                <td className="px-4 py-2 border">{proj.name}</td>
                <td className="px-4 py-2 border">
                  {proj.teamLeader?.name || "-"}
                </td>
                <td className="px-4 py-2 border">{proj.status}</td>
                <td className="px-4 py-2 border">
                  {proj.startDate
                    ? new Date(proj.startDate).toLocaleDateString()
                    : "-"}
                </td>
                <td className="px-4 py-2 border">
                  {proj.endDate
                    ? new Date(proj.endDate).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
