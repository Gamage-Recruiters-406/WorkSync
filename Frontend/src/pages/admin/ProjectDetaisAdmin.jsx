import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import { getProject } from "../../services/ProjectService";

const ProjectDetailsAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Overview");
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusChanging, setStatusChanging] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const URL_API = "http://localhost:8090";

    useEffect(() => {
        const fetchProject = async () => {
            try {
                console.log(`Fetching project with ID: ${id}`);
                
                // Try using ProjectService first
                try {
                    const response = await getProject(id);
                    if (response && response.data) {
                        console.log('Project fetched via ProjectService:', response);
                        setProjectData(response.data);
                        setLoading(false);
                        return;
                    } else if (response) {
                        // If response doesn't have nested data, it might be the data itself
                        console.log('Project fetched via ProjectService (direct):', response);
                        setProjectData(response);
                        setLoading(false);
                        return;
                    }
                } catch (serviceError) {
                    console.warn('ProjectService failed, trying direct axios calls:', serviceError);
                }

                // Fallback 1: Try /api/v1/project-team/getProject
                try {
                    const res = await axios.get(`${URL_API}/api/v1/project-team/getProject/${id}`, {
                        withCredentials: true,
                    });
                    console.log('Project fetched via project-team route:', res.data);
                    setProjectData(res.data.data);
                    setLoading(false);
                    return;
                } catch (err1) {
                    console.warn('project-team route failed:', err1);
                }

                // Fallback 2: Try /api/v1/projects/getProject
                try {
                    const res = await axios.get(`${URL_API}/api/v1/projects/getProject/${id}`, {
                        withCredentials: true,
                    });
                    console.log('Project fetched via projects route:', res.data);
                    setProjectData(res.data.data);
                    setLoading(false);
                    return;
                } catch (err2) {
                    console.warn('projects route failed:', err2);
                }

                // Fallback 3: Try /getProject
                try {
                    const res = await axios.get(`${URL_API}/getProject/${id}`, {
                        withCredentials: true,
                    });
                    console.log('Project fetched via direct route:', res.data);
                    setProjectData(res.data.data || res.data);
                    setLoading(false);
                    return;
                } catch (err3) {
                    console.warn('direct route failed:', err3);
                }

                // All endpoints failed
                console.error("Failed to fetch project from all endpoints");
                setProjectData(null);
                setLoading(false);
            } finally {
                // setLoading is already set in each try block
            }
        };

        const fetchTeam = async () => {
            try {
                const res = await axios.get(`${URL_API}/api/v1/project-team/getMembers/${id}`, { withCredentials: true });
                console.log('Team API Response:', res);
                const members = res?.data?.data || res?.data;
                console.log('Members data:', members);
                if (members) setProjectData(prev => ({ ...(prev || {}), team: members }));
            } catch (err) {
                // If team API fails, keep whatever team is present
                console.warn('Could not fetch team members:', err);
            }
        };

        fetchProject();
        fetchTeam();
    }, [id]);

    const goBack = () => navigate("/admin/projects");

    const handleDeleteFile = async (fileName) => {
        console.log("Delete file:", fileName);
        // keep as placeholder — implement backend file-delete if available
    };

    const handleRemoveMember = async (memberId) => {
        if (!memberId) return;
        if (!window.confirm('Remove this member from project?')) return;
        try {
            await axios.delete(`${URL_API}/api/v1/project-team/removeMember`, 
                { 
                    data: { projectId: id, userId: memberId },
                    withCredentials: true 
                }
            );
            // refresh team
            const res = await axios.get(`${URL_API}/api/v1/project-team/getMembers/${id}`, { withCredentials: true });
            setProjectData(prev => ({ ...(prev || {}), team: res?.data?.data || [] }));
        } catch (err) {
            console.error('Failed to remove member:', err);
            alert('Failed to remove member');
        }
    };

    const handleUploadFile = () => {
        setShowUploadModal(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setUploadFile(file);
        }
    };

    const handleConfirmUpload = async () => {
        if (!uploadFile) {
            alert('Please select a file');
            return;
        }

        const validExtensions = ['pdf', 'docx', 'ppt', 'jpg', 'jpeg', 'png', 'zip'];
        const fileExtension = uploadFile.name.split('.').pop().toLowerCase();
        
        if (!validExtensions.includes(fileExtension)) {
            alert('Invalid file type. Allowed: PDF, DOCX, PPT, JPG, PNG, ZIP');
            return;
        }

        if (uploadFile.size > 20 * 1024 * 1024) { // 20MB
            alert('File size must be less than 20MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', uploadFile);
            formData.append('projectId', id);

            // Replace with your actual upload endpoint
            await axios.post(`${URL_API}/api/v1/project-attachment/upload`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('File uploaded successfully');
            setShowUploadModal(false);
            setUploadFile(null);
            // Optionally refresh files list here
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Failed to upload file');
        } finally {
            setUploading(false);
        }
    };

    const handleCancelUpload = () => {
        setShowUploadModal(false);
        setUploadFile(null);
    };

    const handleStatusChange = async (newStatus) => {
        if (!projectData._id) return;
        setStatusChanging(true);
        try {
            await axios.patch(`${URL_API}/api/v1/project/updateProjectStatus/${projectData._id}`, 
                { status: newStatus }, 
                { withCredentials: true }
            );
            setProjectData(prev => ({ ...(prev || {}), status: newStatus }));
        } catch (err) {
            console.error('Failed to update project status:', err);
            alert('Failed to update project status');
        } finally {
            setStatusChanging(false);
        }
    };

    if (loading) return <p className="p-6 text-center">Loading project details...</p>;
    if (!projectData) return (
        <div className="p-6 text-center">
            <p className="text-red-600 font-semibold">Failed to load project details.</p>
            <button
                onClick={() => navigate("/admin/projects")}
                className="mt-4 px-4 py-2 bg-[#087990] text-white rounded-md hover:bg-[#066a7a]"
            >
                Back to Projects
            </button>
        </div>
    );

    const TABS = ["Overview", "Team", "Milestones", "Files"];

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-6">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={goBack}
                            className="px-2 py-1 border-2 border-[#087990] text-[#087990] rounded-md hover:bg-[#087990] hover:text-white transition-colors font-medium"
                        >
                            Back
                        </button>

                        <h1 className="text-2xl font-bold text-gray-800">{projectData?.name || 'Project'}</h1>

                        <div className="text-right text-sm">
                            <p className="text-gray-600">
                                Deadline: <span className="font-semibold text-gray-800">{projectData?.endDate ? new Date(projectData.endDate).toLocaleDateString() : 'N/A'}</span>
                            </p>
                        </div>
                    </div>

                    {/* Status Row */}
                    <div className="flex items-center gap-2 mb-6 pb-4 border-b">
                        <span className="font-medium text-gray-700">Status:</span>
                        <select
                            value={projectData?.status || "Active"}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            disabled={statusChanging}
                            className="px-3 py-1 border border-[#087990] rounded-md text-gray-800 font-medium cursor-pointer hover:bg-gray-50 disabled:opacity-50"
                        >
                            <option value="Active">Active</option>
                            <option value="On-Hold">On-Hold</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-3 mb-6 border-b pb-2">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-2 py-0.5 rounded-[20px] font-medium transition-all ${
                                    activeTab === tab
                                        ? "bg-[#087990] text-white shadow-md scale-105"
                                        : "bg-white text-[#087990] hover:bg-gray-100 "
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content - Only Active Tab Displayed */}
                    <div>
                        {/* Overview Tab */}
                        {activeTab === "Overview" && (
                            <section className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-[#087990] inline-block">
                                    Overview
                                </h2>

                                {/* Progress Bar */}
                                <div className="mb-6 mt-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-medium text-gray-700">Progress:</span>
                                        <span className="text-sm font-semibold text-gray-800">{projectData?.progress || 0}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#087990] transition-all duration-300"
                                            style={{ width: `${projectData?.progress || 0}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Two Column Layout */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    {/* Projects Summary */}
                                    <div className="border-l-4 border-[#087990] pl-4">
                                        <h3 className="font-semibold text-gray-800 mb-3">Projects Summary</h3>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <p><span className="font-medium">Created by:</span> {typeof projectData.createdBy === 'object' ? projectData.createdBy?.name : projectData.createdBy || 'N/A'}</p>
                                            <p><span className="font-medium">Start Date:</span> {projectData.startDate ? new Date(projectData.startDate).toLocaleDateString() : 'N/A'}</p>
                                            <p><span className="font-medium">End Date:</span> {projectData.endDate ? new Date(projectData.endDate).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Upcoming Milestones */}
                                    <div className="border-l-4 border-[#087990] pl-4">
                                        <h3 className="font-semibold text-gray-800 mb-3">Upcoming Milestones</h3>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            {projectData.upcomingMilestones?.map((milestone, idx) => (
                                                <p key={idx}>{milestone}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div className="border-l-4 border-[#087990] pl-4 mt-6">
                                    <h3 className="font-semibold text-gray-800 mb-3">Recent Activity</h3>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        {projectData.recentActivity?.map((activity, idx) => (
                                            <p key={idx}>{activity}</p>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Team Tab */}
                        {activeTab === "Team" && (
                            <section className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-[#087990] inline-block">
                                    Team
                                </h2>

                                {/* Team Leader */}
                                {projectData.teamLeaderId && (
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                                        <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Team Leader</h3>
                                        <p className="text-gray-700 mt-1 text-lg">{projectData.teamLeaderName || projectData.teamLeaderId}</p>
                                    </div>
                                )}

                                <div className="mt-6">
                                    <h3 className="font-semibold text-gray-800 mb-4">Project Team Members</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b-2 border-gray-200">
                                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                                                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {projectData.team?.map((member, idx) => (
                                                    <tr key={member._id || idx} className="border-b border-gray-100 hover:bg-gray-50">
                                                        <td className="py-3 px-4 text-gray-800">{member.userId?.name || 'N/A'}</td>
                                                        <td className="py-3 px-4 text-gray-700">{member.assignedRole || 'N/A'}</td>
                                                        <td className="py-3 px-4 text-right">
                                                            <button
                                                                onClick={() => handleRemoveMember(member.userId?._id || member._id)}
                                                                className="px-4 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                                                            >
                                                                Remove
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Milestones Tab */}
                        {activeTab === "Milestones" && (
                            <section className="bg-white rounded-lg shadow-sm p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b-2 border-[#087990] inline-block">
                                    Milestones
                                </h2>

                                <div className="mt-6 space-y-4">
                                    {projectData.milestones?.map((milestone, idx) => (
                                        <div
                                            key={idx}
                                            className="border-2 border-[#087990] rounded-lg p-5 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                                                        {milestone.title}
                                                    </h3>
                                                    <div className="space-y-1.5 text-sm text-gray-700">
                                                        <p>
                                                            <span className="font-medium">Start Date:</span> {milestone.startDate}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">End Date:</span> {milestone.endDate}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium">Assigned To You:</span>{" "}
                                                            {milestone.assignedToYou ? "Yes" : "No"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button className="px-5 py-2 bg-[#087990] text-white rounded-md hover:bg-[#076a7a] transition-colors text-sm font-medium">
                                                    Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Files Tab */}
                        {activeTab === "Files" && (
                            <section className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex items-center justify-between mb-4 pb-2 border-b">
                                    <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-[#087990] inline-block pb-2">
                                        Files
                                    </h2>
                                    <button
                                        onClick={handleUploadFile}
                                        className="px-4 py-2 bg-[#087990] text-white rounded-md hover:bg-[#076a7a] transition-colors text-sm font-medium"
                                    >
                                        Upload File
                                    </button>
                                </div>

                                <div className="mt-6 overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b-2 border-gray-200">
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">File Name</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Uploaded By</th>
                                                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                                                <th className="text-right py-3 px-4 font-semibold text-gray-700">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projectData.files?.map((file, idx) => (
                                                <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-gray-800 font-medium">{file.name}</td>
                                                    <td className="py-3 px-4 text-gray-700">{file.uploadedBy}</td>
                                                    <td className="py-3 px-4 text-gray-700">{file.date}</td>
                                                    <td className="py-3 px-4 text-right">
                                                        <button
                                                            onClick={() => handleDeleteFile(file.name)}
                                                            className="px-4 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>

            {/* Upload File Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Files</h2>
                        <p className="text-gray-600 text-sm mb-6">Add project-related documents and files</p>

                        {/* Drag and Drop Area */}
                        <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <div className="flex flex-col items-center">
                                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                </svg>
                                <p className="text-gray-700 font-medium mb-1">Drag & drop files here</p>
                                <p className="text-gray-500 text-sm mb-4">or</p>
                                <label className="px-4 py-2 bg-[#087990] text-white rounded-md hover:bg-[#076a7a] transition-colors text-sm font-medium cursor-pointer">
                                    Browse File
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,.docx,.ppt,.jpg,.jpeg,.png,.zip"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Selected File Info */}
                        {uploadFile && (
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">Selected:</span> {uploadFile.name}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    Size: {(uploadFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        )}

                        {/* File Requirements */}
                        <p className="text-xs text-gray-600 text-center mb-6">
                            Max size: 20MB | Allowed: PDF, DOCX, PPT, JPG, PNG, ZIP
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancelUpload}
                                disabled={uploading}
                                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmUpload}
                                disabled={uploading || !uploadFile}
                                className="flex-1 px-4 py-2 bg-[#087990] text-white rounded-md hover:bg-[#076a7a] transition-colors font-medium disabled:opacity-50"
                            >
                                {uploading ? 'Uploading...' : 'Upload'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetailsAdmin;
