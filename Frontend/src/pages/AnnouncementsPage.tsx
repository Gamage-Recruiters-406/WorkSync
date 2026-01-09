import React, { useEffect, useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import api from "../api/axios";

const MESSAGE_LIMIT = 80;

const AnnouncementsPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openMessage, setOpenMessage] = useState(null);

  // ================= SAFE HELPERS =================
  const normalizeText = (text) =>
    typeof text === "string" ? text.trim() : "";

  const shouldShowReadMore = (text) =>
    normalizeText(text).length > MESSAGE_LIMIT;

  const getShortMessage = (text) => {
    const cleanText = normalizeText(text);
    return cleanText.length > MESSAGE_LIMIT
      ? cleanText.slice(0, MESSAGE_LIMIT) + "..."
      : cleanText;
  };

  // ================= FETCH ANNOUNCEMENTS =================
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        "http://localhost:8090/api/v1/announcement/getEmployeeAnnouncements"
      );
      setAnnouncements(res.data.data || []);
    } catch (err) {
      console.error("Fetch announcements failed", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH NOTIFICATIONS =================
  const fetchNotifications = async () => {
    try {
      const res = await api.get(
        "http://localhost:8090/api/v1/announcement/my-notifications"
      );
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error("Fetch notifications failed", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    fetchNotifications();
  }, []);

  // ================= FILTER ANNOUNCEMENTS =================
  const filteredAnnouncements = announcements.filter((a) => {
    if (activeTab === "pinned") return a.isPinned;
    if (activeTab === "unread") return !a.isRead;
    return true;
  });

  // ================= MARK NOTIFICATION READ =================
  const handleMarkNotificationRead = async (id) => {
    try {
      await api.put(
        `http://localhost:8090/api/v1/announcement/markAsRead/${id}`
      );
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#1F2937]">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* HEADER */}
          <header className="flex items-center justify-between border-b bg-white px-8 py-4">
            <input
              className="w-full max-w-xl rounded-full border px-10 py-2.5 text-sm"
              placeholder="Search"
            />
          </header>

          <div className="flex flex-1">
            {/* ANNOUNCEMENTS */}
            <main className="flex-1 overflow-y-auto px-8 py-6">
              <div className="mb-6 flex gap-2">
                {["all", "pinned", "unread"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm ${
                      activeTab === tab
                        ? "bg-[#0A7C86] text-white"
                        : "text-gray-500"
                    }`}
                  >
                    {tab.toUpperCase()}
                  </button>
                ))}
              </div>

              {loading && <p>Loading announcements...</p>}

              {filteredAnnouncements.map((a) => (
                <div
                  key={a.announcementId}
                  className="mb-6 rounded-lg border bg-white p-6"
                >
                  <h3 className="text-lg font-bold">{a.title}</h3>
                  <p className="mt-4 text-gray-600">{a.message}</p>
                </div>
              ))}
            </main>

            {/* NOTIFICATIONS */}
            <aside className="w-96 border-l bg-white p-6">
              <h2 className="mb-6 text-xl font-bold">Notifications</h2>

              {notifications.map((n) => (
                <div key={n._id} className="border-b pb-4 mb-4">
                  <p className="font-semibold">{n.title}</p>

                  <p className="mt-2 text-sm text-gray-600">
                    {getShortMessage(n.message)}
                  </p>

                  <div className="flex gap-3 mt-2">
                    {shouldShowReadMore(n.message) && (
                      <button
                        onClick={() => setOpenMessage(n.message)}
                        className="text-sm text-[#0A7C86] font-medium"
                      >
                        Read more →
                      </button>
                    )}

                    {!n.isRead && (
                      <button
                        onClick={() =>
                          handleMarkNotificationRead(n._id)
                        }
                        className="text-sm text-gray-500"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </div>

      {/* READ MORE MODAL */}
      {openMessage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <p className="text-gray-700 whitespace-pre-wrap">
              {openMessage}
            </p>
            <button
              onClick={() => setOpenMessage(null)}
              className="mt-4 px-4 py-2 bg-[#0A7C86] text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;
