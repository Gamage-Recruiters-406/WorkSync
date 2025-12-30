const OverviewTab = ({ projectId, milestones = [], teamMembers = [], projectData }) => {
  const total = milestones.length;
  const teamCount = teamMembers.length;
  const completed = milestones.filter(m=> m.status === "Complete").length;
  const inProgress = milestones.filter(m => m.status === "In Progress").length;
  const pending = milestones.filter(m => m.status === "Pending").length;

  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

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
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="font-medium">{progress}%</span>
              </div>

              <p className="mb-1">
                <span className="font-medium">Deadline:</span>{" "}
                {projectData?.deadline || "Not set"}
              </p>

              {/* Milestone stats */}
              <p className="mb-1">
                <span className="font-medium">Milestones:</span>{" "}
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="border rounded-md py-2">
                  <p className="font-semibold">{completed}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div className="border rounded-md py-2">
                  <p className="font-semibold">{inProgress}</p>
                  <p className="text-xs text-gray-500">In Progress</p>
                </div>
                <div className="border rounded-md py-2">
                  <p className="font-semibold">{pending}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
  
              
            </div>
          </div>
  
          {/* Recent activity */}
          <div className="bg-white border rounded-md shadow-sm">
            <div className="border-l-4 border-[#087990] px-4 py-3">
              <h2 className="font-semibold text-lg">Recent Activity</h2>
            </div>
            <div className="px-4 py-4 text-sm text-gray-700 space-y-2">
              <p className="italic">Activity tracking coming soon</p>
            </div>
          </div>
        </div>
  
        {/* Right column – team members */}
        <div className="bg-white border rounded-md shadow-sm">
          <div className="border-l-4 border-[#087990] px-4 py-3">
            <h2 className="font-semibold text-lg">Team Members {`(${teamCount})`}</h2>
          </div>
          <div className="px-4 py-4 space-y-3">
            {teamMembers.length === 0 ? (
              <p className="text-gray-500">No team members yet</p>
              ) : (
                teamMembers.map(member => (
              <div
                key={member._id}
                className="border border-[#087990] rounded-md px-3 py-2 text-sm"
              >
                <p className="font-medium">{member.userId.name}</p>
                <p>Role: {member.assignedRole}</p>
              </div>
            ))
          )}
          </div>
        </div>
      </div>
    );
  };
  
  export default OverviewTab;
  