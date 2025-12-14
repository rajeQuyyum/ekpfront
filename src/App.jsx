import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import LeposavasLogo from "./assets/leposavas-logo.png";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Chat from "./pages/Chat.jsx";
import Notifications from "./pages/Notifications.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import Engineering from "./pages/Engineering.jsx";
import Tech from "./pages/Tech.jsx";
import HomeServices from "./pages/HomeServices.jsx";
import Cars from "./pages/Cars.jsx";
import Houses from "./pages/Houses.jsx";
import Hotels from "./pages/Hotels.jsx";

export default function App() {
  // Global loading screen state
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <div className="relative">

        {/* ✅ Full-screen loading overlay */}
        {initialLoading && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-white backdrop-blur-md z-[9999]">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-black mt-4 text-xl animate-pulse">
                 <img
               src={LeposavasLogo}
               alt="Leposavas Logo"
               className="h-60 rounded-full w-auto"
              />

             Welcome To Leposavas Loading...
            </p>
          </div>
        )}

        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="ele" element={<Engineering />} />
            <Route path="tech" element={<Tech />} />
            <Route path="ser" element={<HomeServices />} />
            <Route path="car" element={<Cars />} />
            <Route path="house" element={<Houses />} />
            <Route path="hostel" element={<Hotels />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}
