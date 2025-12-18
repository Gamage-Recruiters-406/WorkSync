import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  const userId = "E001"; // or get from auth context

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8090/api/v1/userAuth/getUser/${userId}`
      );
      setProfile(res.data); // Assuming API returns { name, email, role, ... }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h2 className="text-heading font-semibold mb-6">Profile</h2>
      <div className="flex gap-8">
        {/* Left Profile Card */}
        <div className="w-72 rounded-2xl bg-[#0b7c8f] text-white flex flex-col items-center justify-center py-10 shadow-lg">
          <img
            src="https://i.pravatar.cc/120"
            alt="Profile"
            className="h-24 w-24 rounded-full border-4 border-white object-cover"
          />
          <h3 className="mt-4 font-semibold text-heading">{profile.name}</h3>
          <p className="text-sm opacity-90">{profile.role}</p>
        </div>

        {/* Right Details Card */}
        <div className="flex-1 rounded-2xl bg-gray-100 p-6 shadow-lg">
          <div className="space-y-4">
            <InputField label="User ID" value={profile.userId} />
            <InputField label="Department ID" value={profile.departmentId} />
            <InputField label="Email" value={profile.email} />
            <InputField label="Password" value="******" />
            <InputField label="STS" value={profile.sts} />
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate("/settings/profile/edit")}
              className="rounded-lg bg-[#0b7c8f] px-6 py-2 font-semibold text-white hover:opacity-90"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

const InputField = ({ label, value }) => (
  <div className="flex flex-col">
    <label className="mb-1 text-sm text-gray-600">{label}</label>
    <input
      type="text"
      value={value}
      disabled
      className="rounded-lg border border-gray-300 bg-gray-200 px-4 py-2 text-gray-800"
    />
  </div>
);
