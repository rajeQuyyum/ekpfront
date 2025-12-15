import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

export default function AdminLogin() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    if (!username || !password) return alert("Enter username & password");

    try {
      const res = await api.post("/admin/login", {
        username,
        password,
      });

      // Save admin session
      localStorage.setItem("adminSession", "true");

      // Redirect to dashboard
      nav("/admin/dashboard");
    } catch (err) {
      alert("Invalid admin credentials");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6  rounded shadow pt-40">
      <div className="bg-white">
        <h1 className="text-xl font-bold mb-4 text-center">Admin Login</h1>

      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-3 rounded"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="w-full bg-black text-white py-2 rounded"
      >
        Login
      </button>
      </div>
    </div>
  );
}
