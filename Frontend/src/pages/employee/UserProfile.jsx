import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { User, Search, Bell } from "lucide-react";
// import axios from "axios";

const UserProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    userId: "E001",
    name: "K Jin",
    role: "Employee",
    departmentId: "IT01",
    email: "Kjin@gmail.com",
    password: "*******",
    sts: "nnnnn",
    avatar: "https://icon-library.com/images/male-avatar-icon/male-avatar-icon-8.jpg"
  });

  // Uncomment to fetch data from API
  /*
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem("userId"); // or from auth context
        const response = await axios.get(`http://localhost:8090/api/v1/userAuth/getUser/${userId}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);
  */

  const handleEditClick = () => {
    navigate("/user/profile/edit");
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // Uncomment to delete via API
        /*
        const userId = localStorage.getItem("userId");
        await axios.delete(`http://localhost:8090/api/v1/userAuth/deleteUser/${userId}`);
        */
        alert("Account deleted successfully");
        navigate("/login");
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087990]"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6 text-[#087990]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{profile.name}</p>
                  <p className="text-xs text-gray-500">{profile.role}</p>
                </div>
                <img
                  src={profile.avatar}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-[#087990] object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Profile Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile</h1>
            
            <div className="flex gap-8">
              {/* Left Profile Card */}
              <div className="w-80 h-[600px] rounded-3xl bg-gradient-to-br from-[#0a7d91] to-[#0b9fb8] text-white flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-white opacity-10 rounded-full"></div>
                <div className="absolute bottom-20 left-5 w-20 h-20 bg-white opacity-10 rounded-full"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative">
                    <img
                      src={profile.avatar}
                      alt="Profile"
                      className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                    <div className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                      <span className="text-2xl">📷</span>
                    </div>
                  </div>
                  
                  <h2 className="mt-6 text-2xl font-bold">{profile.name}</h2>
                  <p className="text-base opacity-90 mt-1">{profile.role}</p>
                </div>
              </div>

              {/* Right Details Card */}
              <div className="flex-1 rounded-3xl bg-white p-8 shadow-lg">
                <div className="space-y-5">
                  {/* User ID */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-2 font-medium">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={profile.userId}
                      disabled
                      className="rounded-xl border border-gray-300 bg-gray-50 px-5 py-3 text-gray-700 font-medium text-lg focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Department ID */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-2 font-medium">
                      Department ID
                    </label>
                    <input
                      type="text"
                      value={profile.departmentId}
                      disabled
                      className="rounded-xl border border-gray-300 bg-gray-50 px-5 py-3 text-gray-700 font-medium text-lg focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-2 font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="rounded-xl border border-gray-300 bg-gray-50 px-5 py-3 text-gray-700 font-medium text-lg focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-2 font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      value={profile.password}
                      disabled
                      className="rounded-xl border border-gray-300 bg-gray-50 px-5 py-3 text-gray-700 font-medium text-lg focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* STS */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-2 font-medium">
                      STS
                    </label>
                    <input
                      type="text"
                      value={profile.sts}
                      disabled
                      className="rounded-xl border border-gray-300 bg-gray-50 px-5 py-3 text-gray-700 font-medium text-lg focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleEditClick}
                      className="flex-1 rounded-xl bg-[#0a7d91] px-6 py-3 font-semibold text-white hover:bg-[#096b7d] transition-colors shadow-md hover:shadow-lg"
                    >
                      Edit Details
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="px-8 rounded-xl border-2 border-[#0a7d91] text-[#0a7d91] px-6 py-3 font-semibold hover:bg-[#0a7d91] hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
