import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAllUsers } from "../../services/adminReportsApi";

const InputField = ({ label, value }) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        disabled
        className="rounded-lg border border-gray-300 bg-gray-100 px-4 py-2 text-gray-700"
      />
    </div>
  );
};

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState();

  const stored = localStorage.getItem("user");
  const data = stored ? JSON.parse(stored) : null;

  const userId = data?.userid;
  console.log(userId);

  const fetchProfile = async () => {
    try {
      const profData = await getAllUsers();
      console.log(profData);
      const user = profData.data.data.filter((user) => user._id === userId);
      console.log(user);
      setProfile(user); // Assuming API returns { name, email, role, ... }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) return <div>Loading...</div>;

  return (
    <main className="">
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-heading font-semibold mb-6">Profile</h2>
        <div className="flex gap-8">
          {/* Left Profile Card */}
          <div className="w-72 rounded-2xl bg-[#0b7c8f] text-white flex flex-col items-center justify-center py-10 shadow-lg">
            <img
              src="https://icon-library.com/images/male-avatar-icon/male-avatar-icon-8.jpg"
              alt="Profile"
              className="h-24 w-24 rounded-full border-4 border-white object-cover"
            />
            <h3 className="mt-4 font-semibold text-heading">
              {profile[0].name}
            </h3>
            <p className="text-sm opacity-90">
              {profile[0].role === 3 ? "Admin" : "User"}
            </p>
          </div>

          {/* Right Details Card */}
          <div className="flex-1 rounded-2xl bg-gray-100 p-6 shadow-lg">
            <div className="space-y-4">
              <InputField label="User ID" value={profile[0].id} />

              <InputField label="Email" value={profile[0].email} />
              <InputField label="Password" value="******" />
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
    </main>
  );
};
export default ProfileSettings;
