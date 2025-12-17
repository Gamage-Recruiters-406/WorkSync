const OverviewTab = ({ project }) => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column (summary + activity) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project summary */}
          <div className="bg-white border rounded-md shadow-sm">
            <div className="border-l-4 border-[#087990] px-4 py-3">
              <h2 className="font-semibold text-lg">Projects Summary</h2>
            </div>
            <div className="px-4 py-4 text-sm text-gray-700">
              <div className="mb-3 flex items-center gap-3">
                <span className="font-medium">Progress:</span>
                <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
                  <div
                    className="h-4 bg-[#087990]"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <span className="font-medium">{project.progress}%</span>
              </div>
  
              <p className="mb-1">
                <span className="font-medium">Deadline:</span>{" "}
                {project.deadline}
              </p>
              <p className="mb-1">
                <span className="font-medium">Your Tasks:</span>{" "}
                {project.tasks.total} ({project.tasks.inProgress} In Progress,{" "}
                {project.tasks.pending} Pending)
              </p>
              <p>
                <span className="font-medium">Milestones Assigned to You:</span>{" "}
                {project.milestonesAssigned}
              </p>
            </div>
          </div>
  
          {/* Recent activity */}
          <div className="bg-white border rounded-md shadow-sm">
            <div className="border-l-4 border-[#087990] px-4 py-3">
              <h2 className="font-semibold text-lg">Recent Activity</h2>
            </div>
            <div className="px-4 py-4 text-sm text-gray-700 space-y-2">
              {project.recentActivity.map((item, idx) => (
                <p key={idx}>&quot;{item}&quot;</p>
              ))}
            </div>
          </div>
        </div>
  
        {/* Right column – team members */}
        <div className="bg-white border rounded-md shadow-sm">
          <div className="border-l-4 border-[#087990] px-4 py-3">
            <h2 className="font-semibold text-lg">Team Members</h2>
          </div>
          <div className="px-4 py-4 space-y-3">
            {project.teamMembers.map((member) => (
              <div
                key={member.id}
                className="border border-[#087990] rounded-md px-3 py-2 text-sm"
              >
                <p className="font-medium">{member.name}</p>
                <p>Role: {member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default OverviewTab;
  