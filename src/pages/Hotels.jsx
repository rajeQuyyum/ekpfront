import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { socket } from "../socket";

function Stars({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <span className="text-yellow-500" key={"f" + i}>★</span>
      ))}
      {half && <span>☆</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={"e" + i}>☆</span>
      ))}
    </div>
  );
}

export default function Hotels() {
  const [items, setItems] = useState([]);

  const loadItems = async () => {
    try {
      const res = await api.get("/hotels");
      setItems(res.data.items || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadItems();

    socket.on("hotel_added", loadItems);
    socket.on("hotel_updated", loadItems);
    socket.on("hotel_deleted", loadItems);

    return () => {
      socket.off("hotel_added");
      socket.off("hotel_updated");
      socket.off("hotel_deleted");
    };
  }, []);

  return (
    <div className="p-6 container mx-auto">
      <h2 className="text-2xl font-bold mb-6">Hotels</h2>

      {items.length === 0 && <p>No hotels available.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="border p-4 rounded shadow bg-white">

            {/* IMAGE */}
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-48 object-cover rounded mb-3"
            />

            {/* NAME */}
            <h3 className="font-semibold text-lg">{item.name}</h3>

            {/* DESCRIPTION */}
            {item.description && (
              <p className="mt-2 text-gray-700 text-sm">{item.description}</p>
            )}

            {/* PHONE */}
            {item.phone && (
              <p className="mt-2 text-sm">
                📞 <a href={`tel:${item.phone}`} className="text-blue-600 underline">
                  {item.phone}
                </a>
              </p>
            )}

            {/* LOCATION */}
            {item.location && (
              <p className="text-sm">📍 {item.location}</p>
            )}

            {/* RATING */}
            <div className="mt-3 flex items-center gap-3">
              <Stars value={Number(item.rating || 0)} />
              <span className="text-sm text-gray-600">
                ({item.rating ?? 0})
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

