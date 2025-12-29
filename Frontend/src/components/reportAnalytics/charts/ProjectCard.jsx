import { useNavigate } from "react-router-dom";

const statusColor = {
  active: "bg-green-500",
  "on-hold": "bg-orange-500",
  completed: "bg-red-500",
};

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/user/project-team/${project.id}`, {state: {project}});
  };

  return (
    <div className="bg-white rounded-md shadow-md border border-gray-200 max-w-md mb-2 overflow-hidden">
      <div className="bg-[#087990] text-white px-4 py-3 rounded-t-md">
        <h2 className="font-semibold">{project.name}</h2>
        <p className="text-xs mt-1">Role: {project.role}</p>
      </div>

      <div className="px-4 py-4 text-sm text-gray-700 space-y-3">
        
        <div className="mt-3">
          <p className="mb-1">Progress:</p>
          <div className="w-full bg-gray-200 h-3 rounded-full">
            <div
              className="h-3 bg-[#087990] rounded-full"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <p className="text-right text-xs mt-1">{project.progress}%</p>
        </div>

        <p className="mt-2">
          Deadline: <span className="font-medium">{project.deadline}</span>
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span
            className={`w-4 h-4 rounded-full ${statusColor[project.status]}`}
            aria-label={project.status}
          ></span>
          <button
            onClick={handleView}
            className="px-4 py-1 rounded-md bg-[#087990] text-white text-sm hover:bg-teal-800"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
