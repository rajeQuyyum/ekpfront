import React, { useState } from "react";
import Chat from "./Chat";
import { BsChatTextFill } from "react-icons/bs";

export default function ChatWind() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* FLOATING CHAT BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 text-5xl  text-blue-700 rounded-full shadow-lg  transition"
      >
        <BsChatTextFill />

      </button>

      {/* FLOATING CHAT WINDOW */}
      {open && (
        <div className="fixed bottom-20 right-5 w-96 max-h-[90vh] bg-white shadow-2xl rounded-xl border overflow-hidden z-50">
          <div className="flex justify-between items-center p-3 bg-blue-600 text-white">
            <h3 className="font-semibold">Support Chat</h3>
            <button onClick={() => setOpen(false)}>✖</button>
          </div>

          {/* Your existing Chat Component */}
          <div className="p-3 overflow-y-auto h-[70vh]">
            <Chat />
          </div>
        </div>
      )}
    </div>
  );
}
