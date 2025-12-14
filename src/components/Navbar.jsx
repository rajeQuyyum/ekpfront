import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { api } from "../utils/api";
import { socket } from "../socket";
import DelayedLink from "./DelayedLink";

export default function Navbar() {
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      const notes = res.data.notifications || [];

      // Count only unread notifications for this "user" identifier
      const unread = notes.filter(n => !n.readBy?.includes("user"));
      setUnreadCount(unread.length);

    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  useEffect(() => {
    loadNotifications();

    // New notification increases unread
    socket.on("new_notification", () => {
      setUnreadCount((prev) => prev + 1);
    });

    // When a notification is updated (e.g. marked read), reload counts
    socket.on("notification_updated", () => {
      loadNotifications();
    });

    // When a notification is deleted, reload counts
    socket.on("notification_deleted", () => {
      loadNotifications();
    });

    // Optional: if server emits notification_read targeted event, decrement
    socket.on("notification_read", (payload) => {
      // payload: { notificationId, userId }
      // Only decrement if this is our "user" id (we're using "user" literal)
      if (payload?.userId === "user") {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } else {
        // fallback to reload to be safe
        loadNotifications();
      }
    });

    return () => {
      socket.off("new_notification");
      socket.off("notification_updated");
      socket.off("notification_deleted");
      socket.off("notification_read");
    };
  }, []);

  return (
    <nav className="bg-gray-900 text-white fixed w-full">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        <div className="text-xl font-bold">LEPO</div>

        <div className="flex items-center gap-6">
          
          <DelayedLink to="/" className="hover:text-blue-300">
            Home
          </DelayedLink>

          <DelayedLink to="/chat" className="hover:text-blue-300">
            Chat
          </DelayedLink>

          {/* 🔥 NOTIFICATION BADGE */}
          <DelayedLink to="/notifications" className="relative hover:text-blue-300">
            Notifications

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-4 px-2 py-1 text-xs bg-red-600 text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </DelayedLink>

          {/* <NavLink to="/admin" className="hover:text-blue-300">
            Admin
          </NavLink> */}

        </div>
      </div>
    </nav>
  );
}
