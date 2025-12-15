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

export default function Houses() {
  const [items, setItems] = useState([]);

  const loadItems = async () => {
    try {
      const res = await api.get("/houses");
      setItems(res.data.items || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadItems();

    socket.on("house_added", loadItems);
    socket.on("house_updated", loadItems);
    socket.on("house_deleted", loadItems);

    return () => {
      socket.off("house_added");
      socket.off("house_updated");
      socket.off("house_deleted");
    };
  }, []);

  return (
    <div className="p-6 container mx-auto pt-20">
      <h2 className="text-2xl font-bold mb-6 text-center">Houses / Hostels</h2>

      {items.length === 0 && <p>No houses available.</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="border p-4 rounded shadow bg-white">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-48 object-cover rounded mb-3"
            />

            <h3 className="font-semibold text-lg">{item.name}</h3>

            <p className="text-gray-700 mt-1">{item.description}</p>

            <p className="text-gray-600 mt-1">📞 {item.phone}</p>
            <p className="text-gray-600">📍 {item.location}</p>

            <div className="mt-3 flex items-center gap-3">
              <Stars value={Number(item.rating || 0)} />
              <div className="text-sm text-gray-600">
                ({item.rating ?? 0})
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
