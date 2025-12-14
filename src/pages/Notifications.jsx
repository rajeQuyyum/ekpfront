import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { socket } from "../socket";
import ChatWidget from "./ChatWidget";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  // Load from backend
  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Real-time: new notification
    socket.on("new_notification", (note) => {
      setNotifications((prev) => [note, ...prev]);
    });

    // Real-time: notification updated (e.g. marked read)
    socket.on("notification_updated", (updated) => {
      setNotifications((prev) =>
        prev.map((n) => (n._id === updated._id ? updated : n))
      );
    });

    // Real-time: notification deleted
    socket.on("notification_deleted", (id) => {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    });

    return () => {
      socket.off("new_notification");
      socket.off("notification_updated");
      socket.off("notification_deleted");
    };
  }, []);

  // Mark as read (do NOT remove)
  const markAsRead = async (id) => {
    try {
      // send a user identifier — replace "user" with real userId when you have auth
      const res = await api.post(`/notifications/${id}/read`, { userId: "user" });

      // Update local copy immediately with returned notification (if provided)
      if (res.data?.notification) {
        const updated = res.data.notification;
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? updated : n))
        );
      } else {
        // fallback: locally set readBy
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === id ? { ...n, readBy: Array.from(new Set([...(n.readBy||[]), "user"])) } : n
          )
        );
      }

      // Note: server will broadcast 'notification_updated', Navbar listens and will reload counts.
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-20">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {notifications.length === 0 && (
        <p className="text-gray-500 text-center">No notifications available.</p>
      )}

      <div className="space-y-4">
        {notifications.map((n) => {
          const isRead = n.readBy?.includes("user");

          return (
            <div
              key={n._id}
              className={`p-4 rounded shadow flex flex-col gap-2 ${
                isRead ? "bg-gray-200" : "bg-white border-l-4 border-blue-600"
              }`}
            >
              <h3 className="font-semibold">{n.title}</h3>
              <p className="text-gray-700">{n.body}</p>
              <p className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </p>

              {!isRead && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="self-start bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Mark as Read
                </button>
              )}
            </div>
          );
        })}
      </div>
      <ChatWidget />
    </div>
  );
}
