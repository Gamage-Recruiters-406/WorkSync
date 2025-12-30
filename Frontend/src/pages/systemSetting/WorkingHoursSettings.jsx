import { useEffect, useState } from "react";

const DEFAULT_SETTINGS = {
  startTime: "08:30",
  endTime: "17:30",
  breakDuration: 60,
  leaveTypes: ["Sick Leave", "Casual Leave", "Annual Leave"],
};

export default function WorkingHoursSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [newLeave, setNewLeave] = useState("");

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("workingHoursSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save to localStorage
  const saveSettings = (updatedSettings) => {
    setSettings(updatedSettings);
    localStorage.setItem(
      "workingHoursSettings",
      JSON.stringify(updatedSettings)
    );
  };

  const addLeaveType = () => {
    if (!newLeave.trim()) return;

    const updatedSettings = {
      ...settings,
      leaveTypes: [...settings.leaveTypes, newLeave.trim()],
    };

    saveSettings(updatedSettings);
    setNewLeave("");
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-8 ">
      <h2 className="text-xl font-semibold mb-6">
        Working Hours Configuration
      </h2>

      {/* Start Time */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Start Time</label>
        <input
          type="time"
          value={settings.startTime}
          onChange={(e) =>
            saveSettings({ ...settings, startTime: e.target.value })
          }
          className="w-full rounded-lg px-3 py-2 border border-[#087990] focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* End Time */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">End Time</label>
        <input
          type="time"
          value={settings.endTime}
          onChange={(e) =>
            saveSettings({ ...settings, endTime: e.target.value })
          }
          className="w-full rounded-lg px-3 py-2 border border-[#087990] focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Break Duration */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">
          Break Duration (Minutes)
        </label>
        <input
          type="number"
          min="0"
          value={settings.breakDuration}
          onChange={(e) =>
            saveSettings({
              ...settings,
              breakDuration: Number(e.target.value),
            })
          }
          className="w-full rounded-lg px-3 py-2 border border-[#087990] focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <hr className="my-6" />

      {/* Leave Types */}
      <h3 className="text-lg font-semibold mb-3">Leave Types</h3>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Example: Sick Leave"
          value={newLeave}
          onChange={(e) => setNewLeave(e.target.value)}
          className="w-full rounded-lg px-3 py-2 border border-[#087990] focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={addLeaveType}
          className="bg-[#087990] text-white px-4 py-2 rounded-lg hover:text-black hover:bg-gray-300"
        >
          Add leave type
        </button>
      </div>

      {/* Existing Leave Types Table */}
      <div className="border border-[#087990] rounded-lg overflow-hidden mb-6">
        <div className="bg-gray-300 px-4 py-2 font-medium border-b border-[#087990]">
          Existing Leave Types
        </div>
        <ul>
          {settings.leaveTypes.map((leave, index) => (
            <li key={index} className="px-4 py-2 border-t text-sm">
              {leave}
            </li>
          ))}
        </ul>
      </div>

      {/* Leave Dropdown */}
      <div>
        {/*<label className="block text-sm font-medium mb-1">
          Leave Type Dropdown
        </label>
        <select className="w-full border rounded-lg px-3 py-2">
          {settings.leaveTypes.map((leave, index) => (
            <option key={index}>{leave}</option>
          ))}
        </select>*/}
      </div>
    </div>
  );
}
