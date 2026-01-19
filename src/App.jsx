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
import About from "./pages/About.jsx";

/* 🔴 GLOBAL FAIL SWITCH
   Change to false when you want the site live */
const SITE_FAILED = true;

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <div className="relative min-h-screen">

        {/* ❌ FAILED SCREEN (BLOCKS ENTIRE APP) */}
        {SITE_FAILED && (
          <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
            <img
              src={LeposavasLogo}
              alt="Leposavas Logo"
              className="h-40 mb-6"
            />

            <h1 className="text-4xl font-bold text-red-600 mb-3">
              Failed to Load
            </h1>

            <p className="text-gray-600 text-center max-w-md text-lg">
              Something went wrong while loading Leposavas.
              <br />
              Please try again later.
            </p>
          </div>
        )}

        {/* ✅ NORMAL APP (ONLY SHOWS WHEN SITE_FAILED = false) */}
        {!SITE_FAILED && (
          <>
            {/* Loading Screen */}
            {initialLoading && (
              <div className="fixed inset-0 flex flex-col items-center justify-center bg-white backdrop-blur-md z-50">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

                <img
                  src={LeposavasLogo}
                  alt="Leposavas Logo"
                  className="h-60 rounded-full w-auto mb-3"
                />

                <p className="text-black mt-4 text-xl animate-pulse">
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
                <Route path="/ele" element={<Engineering />} />
                <Route path="/tech" element={<Tech />} />
                <Route path="/ser" element={<HomeServices />} />
                <Route path="/car" element={<Cars />} />
                <Route path="/house" element={<Houses />} />
                <Route path="/hostel" element={<Hotels />} />
                <Route path="/abt" element={<About />} />
              </Routes>
            </main>
          </>
        )}

      </div>
    </BrowserRouter>
  );
}
