import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
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
  return (
    <BrowserRouter>
      <div className="">
        <Navbar />

        <main className="">
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
