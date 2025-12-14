import React, { useState, useEffect, useRef } from "react";
import { api } from "../utils/api";
import { socket } from "../socket";

export default function Chat() {
  const [mode, setMode] = useState("login"); // login | register | chat
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 📌 Load messages
  const loadMessages = async (userId) => {
    try {
      const res = await api.get(`/messages/user/${userId}`);
      setMessages(res.data.messages || []);
    } catch {}
  };

  // 📌 Login user
  const login = async () => {
    try {
      const res = await api.post("/user/login-by-name", { name });
      setUser(res.data.user);
      setMode("chat");
      loadMessages(res.data.user._id);

      socket.emit("register", res.data.user._id);
      listenForAdminReply(res.data.user._id);
    } catch {
      alert("User not found. Please register.");
      setMode("register");
    }
  };

  // 📌 Register user
  const register = async () => {
    try {
      const res = await api.post("/user/register", {
        name,
        email,
        phone,
      });
      setUser(res.data.user);
      setMode("chat");

      socket.emit("register", res.data.user._id);
      listenForAdminReply(res.data.user._id);
    } catch {
      alert("Error registering user");
    }
  };

  // 📌 Send message
  const sendMessage = async () => {
    if (!text.trim()) return;

    await api.post("/messages/send", {
      name,
      email: user?.email || email,
      phone: user?.phone || phone,
      text,
    });

    setText("");
    loadMessages(user._id);
  };

  // 🔥 Listen for admin replies
  const listenForAdminReply = (userId) => {
    socket.off("admin_reply");

    socket.on("admin_reply", (msg) => {
      if (msg.userId === userId) {
        setMessages((prev) => [...prev, msg]);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto  pt-40">

      {/* LOGIN SCREEN */}
      {mode === "login" && !user && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Returning User</h2>

          <input
            className="border p-2 w-full mb-3"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />

          <button
            onClick={login}
            className="w-full bg-blue-600 text-white p-2 rounded"
          >
            Login
          </button>

          <p className="mt-3 text-center text-sm">
            New user?{" "}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => setMode("register")}
            >
              Register here
            </span>
          </p>
        </div>
      )}

      {/* REGISTER SCREEN */}
      {mode === "register" && !user && (
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Register New User</h2>

          <input
            className="border p-2 w-full mb-2"
            placeholder="Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="border p-2 w-full mb-2"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border p-2 w-full mb-3"
            placeholder="Phone"
            onChange={(e) => setPhone(e.target.value)}
          />

          <button
            onClick={register}
            className="w-full bg-green-600 text-white p-2 rounded"
          >
            Register & Start Chatting
          </button>
        </div>
      )}

      {/* CHAT SCREEN */}
      {user && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            Chatting as <span className="text-blue-600">{user.name}</span>
          </h2>

          <div className="bg-red-200 p-4 h-80 overflow-y-auto rounded shadow mb-4">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              const time = new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={m._id}
                  className={`mb-3 flex ${isUser ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded shadow ${
                      isUser ? "bg-gray-200" : "bg-blue-600 text-white"
                    }`}
                  >
                    {/* NAME */}
                    <div className="text-xs font-bold mb-1">
                      {isUser ? user.name : "Admin"}
                    </div>

                    {/* TEXT */}
                    <div className="text-sm">{m.text}</div>

                    {/* TIME */}
                    <div className="text-[10px] text-gray-600 mt-1 text-right opacity-70">
                      {time}
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>

          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 border p-2 rounded"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
