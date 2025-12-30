import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { socket } from "../socket";
import DelayedLink from "./DelayedLink";
import LeposavasLogo from "../assets/leposavas-logo.png";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";

export default function Navbar() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hideMobileNavbar, setHideMobileNavbar] = useState(false);
   const [showRenters, setShowRenters] = useState(false);

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
          <h1>Leposavas ProfTech</h1>
        </div>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-6">
          <DelayedLink to="/">Home</DelayedLink>
          <DelayedLink to="/abt">About</DelayedLink>
          <DelayedLink to="/ele">
                    Engineering Services
                  </DelayedLink>
          
                  <DelayedLink to="/tech">
                    Tech Services
                  </DelayedLink>
          
                  <DelayedLink to="/ser">
                    Home Services
                  </DelayedLink>



                  <div>
                            <button
                              onClick={() => setShowRenters(!showRenters)}
                              className="text-xl font-semibold hover:text-amber-400"
                            >
                              Renters Services ▼
                            </button>
                  
                            {showRenters && (
                              <div className="flex flex-col animate-fadeIn">
                                <DelayedLink to="/car">Cars</DelayedLink>
                                <DelayedLink to="/house">House/Hostels</DelayedLink>
                                <DelayedLink to="/hostel">Hotel/Appartment</DelayedLink>
                              </div>
                            )}
                          </div>

               <DelayedLink
  to="/notifications"
  onClick={handleMobileLinkClick}
  className="relative"
>
  <IoIosNotificationsOutline
    className={`text-2xl ${
      unreadCount > 0 ? "text-red-600" : "text-white"
    }`}
  />

  {unreadCount > 0 && (
    <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full" />
  )}
</DelayedLink>

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

          <DelayedLink to="/abt" onClick={handleMobileLinkClick}>
            About
          </DelayedLink>

          

          <DelayedLink to="/ele">
                    Engineering Services
                  </DelayedLink>
          
                  <DelayedLink to="/tech">
                    Tech Services
                  </DelayedLink>
          
                  <DelayedLink to="/ser">
                    Home Services
                  </DelayedLink>

                  <div>
                            <button
                              onClick={() => setShowRenters(!showRenters)}
                              className="text-xl font-semibold hover:text-amber-400"
                            >
                              Renters Services ▼
                            </button>
                  
                            {showRenters && (
                              <div className="flex flex-col mt-3 animate-fadeIn">
                                <DelayedLink to="/car">Cars</DelayedLink>
                                <DelayedLink to="/house">House/Hostels</DelayedLink>
                                <DelayedLink to="/hostel">Hotel/Appartment</DelayedLink>
                              </div>
                            )}
                          </div>


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
