import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { Search, Bell, Edit2 } from "lucide-react";
// import axios from "axios";

const UserProfileEdit = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // Initialize with current user data
  const [originalProfile] = useState({
    userId: "E001",
    name: "K Jin",
    role: "Employee",
    departmentId: "IT01",
    email: "Kjin@gmail.com",
    password: "*******",
    sts: "nnnnn",
    avatar: "https://icon-library.com/images/male-avatar-icon/male-avatar-icon-8.jpg"
  });

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

  const [editingField, setEditingField] = useState(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, avatar: previewUrl }));
    setEditingField(null);
  };

  const handleInputChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditClick = (field) => {
    setEditingField(field);
  };

  const handleSaveChanges = async () => {
    try {
      // Uncomment to send data to API
      /*
      const userId = localStorage.getItem("userId");
      await axios.put(`http://localhost:8090/api/v1/userAuth/updateUser/${userId}`, profile);
      alert("Profile updated successfully!");
      */
      
      alert("Profile updated successfully!");
      navigate("/user/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleReset = () => {
    setProfile(originalProfile);
    setEditingField(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

        {/* Profile Edit Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">ProfileEdit</h1>
            
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
                    <button
                      type="button"
                      onClick={handleAvatarClick}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
                      aria-label="Upload profile picture"
                    >
                      <span className="text-2xl">📷</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                  
                  <h2 className="mt-6 text-2xl font-bold">{profile.name}</h2>
                  <p className="text-base opacity-90 mt-1">{profile.role}</p>
                </div>
              </div>

              {/* Right Edit Form Card */}
              <div className="flex-1 rounded-3xl bg-white p-8 shadow-lg">
                <div className="space-y-5">
                  {/* User ID */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-2 font-medium">
                      User ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.userId}
                        onChange={(e) => handleInputChange('userId', e.target.value)}
                        disabled={editingField !== 'userId'}
                        className={`w-full rounded-xl border border-gray-300 px-5 py-3 pr-12 text-gray-700 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-[#087990] ${
                          editingField !== 'userId' ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                        }`}
                      />
                      <button
                        onClick={() => handleEditClick('userId')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#087990] transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Department ID */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-2 font-medium">
                      Department ID
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.departmentId}
                        onChange={(e) => handleInputChange('departmentId', e.target.value)}
                        disabled={editingField !== 'departmentId'}
                        className={`w-full rounded-xl border border-gray-300 px-5 py-3 pr-12 text-gray-700 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-[#087990] ${
                          editingField !== 'departmentId' ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                        }`}
                      />
                      <button
                        onClick={() => handleEditClick('departmentId')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#087990] transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-2 font-medium">
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        disabled={editingField !== 'email'}
                        className={`w-full rounded-xl border border-gray-300 px-5 py-3 pr-12 text-gray-700 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-[#087990] ${
                          editingField !== 'email' ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                        }`}
                      />
                      <button
                        onClick={() => handleEditClick('email')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#087990] transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-2 font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={editingField === 'password' ? 'text' : 'password'}
                        value={profile.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        disabled={editingField !== 'password'}
                        className={`w-full rounded-xl border border-gray-300 px-5 py-3 pr-12 text-gray-700 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-[#087990] ${
                          editingField !== 'password' ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                        }`}
                      />
                      <button
                        onClick={() => handleEditClick('password')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#087990] transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* STS */}
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-500 mb-2 font-medium">
                      STS
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.sts}
                        onChange={(e) => handleInputChange('sts', e.target.value)}
                        disabled={editingField !== 'sts'}
                        className={`w-full rounded-xl border border-gray-300 px-5 py-3 pr-12 text-gray-700 font-medium text-lg focus:outline-none focus:ring-2 focus:ring-[#087990] ${
                          editingField !== 'sts' ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
                        }`}
                      />
                      <button
                        onClick={() => handleEditClick('sts')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#087990] transition-colors"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSaveChanges}
                      className="flex-1 rounded-xl bg-[#0a7d91] px-6 py-3 font-semibold text-white hover:bg-[#096b7d] transition-colors shadow-md hover:shadow-lg"
                    >
                      Save All Changes
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-8 rounded-xl border-2 border-[#0a7d91] text-[#0a7d91] px-6 py-3 font-semibold hover:bg-[#0a7d91] hover:text-white transition-colors"
                    >
                      Reset
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

export default UserProfileEdit;
