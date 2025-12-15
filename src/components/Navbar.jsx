import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { socket } from "../socket";
import DelayedLink from "./DelayedLink";
import LeposavasLogo from "../assets/leposavas-logo.png";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hideMobileNavbar, setHideMobileNavbar] = useState(false);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const res = await api.get("/notifications");
        const notes = res.data.notifications || [];
        const unread = notes.filter(n => !n.readBy?.includes("user"));
        setUnreadCount(unread.length);
      } catch {}
    };

    loadNotifications();

    socket.on("new_notification", () =>
      setUnreadCount((prev) => prev + 1)
    );

    return () => socket.off("new_notification");
  }, []);

  // 🔥 HIDE NAVBAR ONLY ON MOBILE
  if (hideMobileNavbar && isMobile) return null;

  const handleMobileLinkClick = () => {
    setMenuOpen(false);
    setHideMobileNavbar(true);
  };

  return (
    <nav className="animated-blue-gradient text-white fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <div className="flex items-center gap-2 font-bold text-xl">
          <img src={LeposavasLogo} className="w-9 h-9 rounded-full" />
          <h1>Leposavas</h1>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6">
          <DelayedLink to="/">Home</DelayedLink>
          <DelayedLink to="/chat">Chat</DelayedLink>
          <DelayedLink to="/notifications">Notifications</DelayedLink>
        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-blue-900/95 px-6 py-4 flex flex-col gap-4">
          <DelayedLink to="/" onClick={handleMobileLinkClick}>
            Home
          </DelayedLink>

          <DelayedLink to="/chat" onClick={handleMobileLinkClick}>
            Chat
          </DelayedLink>

          <DelayedLink to="/notifications" onClick={handleMobileLinkClick}>
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-xs bg-red-600 px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </DelayedLink>
        </div>
      )}
    </nav>
  );
}
