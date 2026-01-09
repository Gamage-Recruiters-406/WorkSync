import React, { useEffect, useState } from "react";
import {
  Bell,
  Search,
  Megaphone,
  Plus,
  List,
  Check,
  Share,
  Paperclip,
  Eye,
  User,
  Calendar,
  ChevronDown,
  Pin,
} from "lucide-react";
import Sidebar from "../components/sidebar/Sidebar";
import api from "../api/axios";

const PRIMARY = "#087990";
const DELETE_COLOR = "#E53E3E";

const AnnouncementsManagement = () => {
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
console.log(res)
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
    await api.delete(`http://localhost:8090/api/v1/announcement/deleteAnnouncement/${id}`);
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

  // ================= UI =================
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* ================= HEADER ================= */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-md">
              <Search
                size={18}
                color={PRIMARY}
                className="absolute left-3 top-1/2 -translate-y-1/2"
              />
              <input
                placeholder="Search announcements..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                style={{ borderColor: PRIMARY }}
              />
            </div>

            <div className="flex items-center gap-5">
              <Bell size={22} color={PRIMARY} />
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-full text-white flex items-center justify-center"
                  style={{ backgroundColor: PRIMARY }}
                >
                  S
                </div>
                <div>
                  <p className="text-sm font-medium">Sachi</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="p-6 flex-1 overflow-auto">
          <div className="flex items-center gap-2 mb-6">
            <Megaphone size={22} />
            <h1 className="text-xl font-semibold">
              Announcements Management
            </h1>
          </div>

          {/* ================= STATS & BUTTONS ================= */}
          <div className="flex justify-between mb-6">
            <div className="grid grid-cols-4 gap-4">
              {[
                `Total : ${
                  pinnedAnnouncements.length + recentAnnouncements.length
                }`,
                `Pinned : ${pinnedAnnouncements.length}`,
                `Active : ${recentAnnouncements.length}`,
                "Expired : 0",
              ].map((s) => (
                <div
                  key={s}
                  className="bg-white border px-6 py-3 rounded-lg text-sm text-center"
                >
                  {s}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 border rounded-lg"
                style={{ borderColor: PRIMARY, color: PRIMARY }}
              >
                <Plus size={18} /> Create New
              </button>

              <button
                className="flex items-center gap-2 px-4 py-2 border rounded-lg"
                style={{ borderColor: PRIMARY, color: PRIMARY }}
              >
                <List size={18} /> View All
              </button>
            </div>
          </div>

          {/* ================= FILTERS ================= */}
          <div className="flex gap-4 mb-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded-lg"
              style={{ borderColor: PRIMARY }}
            />

            <div className="relative">
              <button
                onClick={() => setShowAll(!showAll)}
                className="px-4 py-2 border rounded-lg w-40 flex justify-between"
                style={{ borderColor: PRIMARY, color: PRIMARY }}
              >
                {selectedAll}
                <ChevronDown size={16} />
              </button>

              {showAll && (
                <div className="absolute bg-white border mt-2 rounded-lg w-40">
                  {["All", "Active", "Draft", "Expired"].map((i) => (
                    <div
                      key={i}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedAll(i);
                        setShowAll(false);
                      }}
                    >
                      {i}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ================= PINNED ================= */}
          <div className="flex items-center gap-2 mb-4">
            <Pin size={18} />
            <h2 className="text-lg font-semibold">
              Pinned Announcements
            </h2>
          </div>

          {pinnedAnnouncements.map((item) => (
            <div
              key={item.announcementId}
              className="bg-white border rounded-xl p-6 mb-4"
            >
              <h3 className="text-lg font-semibold mb-2">
                {item.title}
              </h3>

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

              <div className="flex justify-between">
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

          {/* ================= RECENT ================= */}
          <h2 className="text-lg font-semibold mb-4">
            Recent Announcements
          </h2>

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
                    onClick={() => handleLike(item.announcementId)}
                    className="w-full px-4 py-2 border rounded-lg"
                    style={{ borderColor: PRIMARY, color: PRIMARY }}
                  >
                    👍 Like ({item.likesCount || 0})
                  </button>

                  <button
                    onClick={() => handleDelete(item.announcementId)}
                    className="px-4 py-2 border rounded-lg"
                    style={{
                      borderColor: DELETE_COLOR,
                      color: DELETE_COLOR,
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ================= LOAD MORE ================= */}
          <div className="flex justify-center mt-6">
            <button
              className="px-6 py-2 text-white rounded-lg"
              style={{ backgroundColor: PRIMARY }}
            >
              Load more announcements
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnnouncementsManagement;
