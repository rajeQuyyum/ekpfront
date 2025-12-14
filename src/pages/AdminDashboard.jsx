import React, { useEffect, useState, useRef } from "react";
import { api } from "../utils/api";
import { socket } from "../socket";
import { useNavigate } from "react-router-dom";
import AdminEngineering from "./AdminEngineering";
import AdminTech from "./AdminTech";
import AdminHomeServices from "./AdminHomeServices";
import AdminCars from "./AdminCars";
import AdminHouses from "./AdminHouses";
import AdminHotels from "./AdminHotels";
import AdminAdvert from "./AdminAdvert";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");

  const chatBottomRef = useRef(null);
  const nav = useNavigate();

  // 🔥 LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("adminSession");
    nav("/admin");
  };

  useEffect(() => {
    const isAdmin = localStorage.getItem("adminSession");
    if (!isAdmin) {
      nav("/admin");
      return;
    }

    loadUsers();

    socket.on("new_message", () => {
      loadUsers();
      if (selected) loadSelectedChat(selected._id);
    });

    socket.on("admin_reply", (msg) => {
      if (selected && msg.userId === selected._id) {
        setSelected((prev) => ({
          ...prev,
          messages: [...prev.messages, msg],
        }));
        scrollToBottom();
      }
    });

    return () => {
      socket.off("new_message");
      socket.off("admin_reply");
    };
  }, [selected]);

  const scrollToBottom = () => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const loadUsers = async () => {
    try {
      const res = await api.get("/messages/all-grouped");
      setUsers(res.data.data || []);
    } catch {}
  };

  const loadSelectedChat = async (userId) => {
    try {
      const res = await api.get(`/messages/user/${userId}`);
      setSelected((prev) => ({
        ...prev,
        messages: res.data.messages,
      }));
      scrollToBottom();
    } catch {}
  };

  const sendReply = async () => {
    if (!reply.trim()) return alert("Type a message");
    try {
      const res = await api.post(`/messages/user/${selected._id}/reply`, { text: reply });
      const newMessage = res.data.message;
      setSelected((prev) => ({
        ...prev,
        messages: [...prev.messages, newMessage],
      }));
      setReply("");
      scrollToBottom();
    } catch {
      alert("Failed to reply");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await api.delete(`/messages/${id}`);
      loadSelectedChat(selected._id);
      loadUsers();
    } catch {}
  };

  const clearChat = async (id) => {
    if (!window.confirm("Clear entire chat?")) return;
    try {
      await api.delete(`/messages/user/${id}/clear`);
      setSelected(null);
      loadUsers();
    } catch {}
  };

  const createNotification = async () => {
    if (!noteTitle || !noteBody) return alert("Enter both title & message");

    try {
      await api.post("/notifications", {
        title: noteTitle,
        body: noteBody,
      });

      setNoteTitle("");
      setNoteBody("");

      alert("Notification created");
    } catch {}
  };

  return (
    <div className="flex md:flex-row flex-col pt-10 justify-center">

      {/* USERS LIST */}
      <div className="bg-white p-4 rounded shadow h-[70vh] overflow-y-auto border">
        <h2 className="font-bold mb-3">Users</h2>

        {users.length === 0 && <p className="text-gray-500">No chats yet</p>}

        {users.map((u) => (
          <div
            key={u._id}
            onClick={() => {
              setSelected(u);
              loadSelectedChat(u._id);
            }}
            className="md:w-fit w-full p-3 rounded mb-2 cursor-pointer hover:bg-gray-100"
          >
            <div className="font-semibold">{u.name}</div>
            <div className="text-xs text-gray-500">
              {u.email} • {u.phone}
            </div>
            <div className="text-xs text-gray-400 border-b-2">
              Messages: {u.messages.length}
            </div>
          </div>
        ))}
      </div>

      {/* CHAT VIEW */}
      <div className="lg:col-span-2 bg-white p-4 rounded shadow mb-">

        {!selected && <p className="text-gray-500">Select a user to view messages</p>}

        {selected && (
          <>
            <div className="flex justify-between mb-3">
              <h2 className="text-lg font-bold">Chat with {selected.name}</h2>
              <button
                onClick={() => clearChat(selected._id)}
                className="text-red-600 text-sm"
              >
                Clear Chat
              </button>
            </div>

            <div className="border rounded p-3 h-64 overflow-y-auto mb-4">
              {selected.messages.map((m) => (
        <div
        key={m._id}
       className={`flex mb-3 ${m.sender === "admin" ? "justify-end" : "justify-start"}`}
      >
    <div
      className={`p-3 rounded-lg shadow max-w-xs ${
        m.sender === "admin"
          ? "bg-blue-600 text-white"
          : "bg-gray-200 text-black"
      }`}
    >
      <div className="text-xs font-semibold mb-1">
        {m.sender === "admin" ? "Admin" : selected.name}
      </div>

      <div className="text-sm">{m.text}</div>

      <div className="text-[10px] mt-1 opacity-70">
        {new Date(m.createdAt).toLocaleString()}
      </div>

      <button
        onClick={() => deleteMessage(m._id)}
        className="text-[10px] text-red-200 mt-1 underline"
      >
        Delete
      </button>
    </div>
     </div>
    ))}


              <div ref={chatBottomRef} />
            </div>

            <div className="flex gap-2">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="border p-2 rounded flex-1"
                placeholder="Type reply..."
              />
              <button
                onClick={sendReply}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Send
              </button>
            </div>
          </>
        )}

        <hr className="my-6" />

        {/* CREATE NOTIFICATION */}
        <div className="mt-10 bg-amber-300">
          <h2 className="font-bold mb-2">Create Notification</h2>

          <input
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder="Title"
            className="border w-full p-2 mb-2 rounded"
          />

          <textarea
            value={noteBody}
            onChange={(e) => setNoteBody(e.target.value)}
            placeholder="Message"
            rows="3"
            className="border w-full p-2 mb-2 rounded"
          />

          <button
            onClick={createNotification}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create Notification
          </button>
        </div>

        {/* 🔥 NOTIFICATION LIST ADDED HERE */}
        <NotificationList />

      </div>
    </div>
  );
}

/* ---------------- NOTIFICATION LIST COMPONENT ---------------- */

function NotificationList() {
  const [notifications, setNotifications] = React.useState([]);
  const [editingId, setEditingId] = React.useState(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editBody, setEditBody] = React.useState("");

  const load = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch {}
  };

  React.useEffect(() => {
    load();

    socket.on("new_notification", load);
    socket.on("notification_deleted", load);
    socket.on("notification_updated", load);

    return () => {
      socket.off("new_notification");
      socket.off("notification_deleted");
      socket.off("notification_updated");
    };
  }, []);

  const startEdit = (n) => {
    setEditingId(n._id);
    setEditTitle(n.title);
    setEditBody(n.body);
  };

  const saveEdit = async (id) => {
    if (!editTitle || !editBody) return alert("Fill all fields");

    await api.put(`/notifications/${id}`, {
      title: editTitle,
      body: editBody,
    });

    setEditingId(null);
    load();
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    await api.delete(`/notifications/${id}`);
    load();
  };

  return (
    <div className="mt-8">
      <h2 className="font-bold mb-3">All Notifications</h2>

      {notifications.length === 0 && (
        <p className="text-gray-500">No notifications yet</p>
      )}

      {notifications.map((n) => (
        <div
          key={n._id}
          className="border p-3 rounded mb-3 bg-gray-50"
        >
          {editingId === n._id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border p-2 w-full mb-2 rounded"
              />

              <textarea
                value={editBody}
                onChange={(e) => setEditBody(e.target.value)}
                className="border p-2 w-full mb-2 rounded"
                rows="3"
              />

              <div className="flex gap-2">
                <button
                  onClick={() => saveEdit(n._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="font-semibold">{n.title}</div>
              <div className="text-sm mt-1">{n.body}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => startEdit(n)}
                  className="text-blue-600 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteNote(n._id)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      <AdminEngineering />
      <AdminTech />
      <AdminHomeServices />
      <AdminCars />
      <AdminHouses />
      <AdminHotels />
      <AdminAdvert />
    </div>
  );
}
