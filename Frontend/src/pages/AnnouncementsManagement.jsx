import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ ADD THIS
import {
  Bell,
  Search,
  Megaphone,
  Plus,
  List,
  Check,
  Share,
  Paperclip,
  Calendar,
  ChevronDown,
  Pin,
} from "lucide-react";

import Sidebar from "../components/sidebar/Sidebar";
import api from "../api/axios";

const PRIMARY = "#087990";
const DELETE_COLOR = "#E53E3E";

const AnnouncementsManagement = () => {
  const navigate = useNavigate(); // ✅ ADD THIS

  const [showAll, setShowAll] = useState(false);
  const [selectedAll, setSelectedAll] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [pinnedAnnouncements, setPinnedAnnouncements] = useState([]);
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH =================
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);

      const res = await api.get(
        "http://localhost:8090/api/v1/announcement/getAnnouncements"
      );

      const data = res.data.data || [];
      setPinnedAnnouncements(data.filter((a) => a.isPinned));
      setRecentAnnouncements(data.filter((a) => !a.isPinned));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // ================= ACTIONS =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    await api.delete(
      `http://localhost:8090/api/v1/announcement/deleteAnnouncement/${id}`
    );
    fetchAnnouncements();
  };

  const handleLike = async (id) => {
    await api.put(`http://localhost:8090/api/v1/announcement/like/${id}`);
    fetchAnnouncements();
  };

  const handleShare = (title) => {
    navigator.clipboard.writeText(title);
    alert("Announcement copied to clipboard");
  };

  const handleMarkRead = () => {
    alert("Mark as Read handled via notifications");
  };

  // ✅ NEW: view details
  const handleViewDetails = (id) => {
    navigate(`/announcement-detail/${id}`);
  };

  // ================= UI =================
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* HEADER ... keep same */}

        <main className="p-6 flex-1 overflow-auto">
          {/* PINNED */}
          <div className="flex items-center gap-2 mb-4">
            <Pin size={18} />
            <h2 className="text-lg font-semibold">Pinned Announcements</h2>
          </div>

          {pinnedAnnouncements.map((item) => (
            <div
              key={item.announcementId}
              className="bg-white border rounded-xl p-6 mb-4"
            >
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm mb-3">{item.message}</p>

              <div className="flex gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Paperclip size={14} />
                  {item.attachments?.length || 0}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <button
                  onClick={() => handleViewDetails(item.announcementId)} // ✅ ADD
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg"
                  style={{ borderColor: PRIMARY, color: PRIMARY }}
                >
                  View Details
                </button>

                <button
                  onClick={handleMarkRead}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg"
                  style={{ borderColor: PRIMARY, color: PRIMARY }}
                >
                  <Check size={16} /> Mark as Read
                </button>

                <button
                  onClick={() => handleShare(item.title)}
                  className="flex items-center gap-2 px-5 py-2 text-white rounded-lg"
                  style={{ backgroundColor: PRIMARY }}
                >
                  <Share size={16} /> Share
                </button>
              </div>
            </div>
          ))}

          {/* RECENT */}
          <h2 className="text-lg font-semibold mb-4">Recent Announcements</h2>

          <div className="grid grid-cols-2 gap-4">
            {recentAnnouncements.map((item) => (
              <div
                key={item.announcementId}
                className="bg-white border rounded-xl p-5"
              >
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm mb-3">{item.message}</p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(item.announcementId)} // ✅ ADD
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: PRIMARY, color: PRIMARY }}
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => handleLike(item.announcementId)}
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: PRIMARY, color: PRIMARY }}
                  >
                    👍 Like ({item.likesCount || 0})
                  </button>

                  <button
                    onClick={() => handleDelete(item.announcementId)}
                    className="px-4 py-2 border rounded-lg"
                    style={{ borderColor: DELETE_COLOR, color: DELETE_COLOR }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnnouncementsManagement;
