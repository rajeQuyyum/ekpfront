import React, { useEffect, useState } from "react";
import { api } from "../utils/api";
import { socket } from "../socket";
import ChatWind from "./ChatWidget";

function Stars({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: full }).map((_, i) => (
        <span className="text-yellow-500" key={"f" + i}>★</span>
      ))}
      {half && <span className="text-yellow-500">☆</span>}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={"e" + i} className="text-gray-400">☆</span>
      ))}
    </div>
  );
}

export default function Tech() {
  const [items, setItems] = useState([]);

  const loadItems = async () => {
    try {
      const res = await api.get("/tech");
      setItems(res.data.items || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadItems();

    socket.on("tech_added", loadItems);
    socket.on("tech_updated", loadItems);
    socket.on("tech_deleted", loadItems);

    return () => {
      socket.off("tech_added");
      socket.off("tech_updated");
      socket.off("tech_deleted");
    };
  }, []);

  return (
    <div className="p-6 container mx-auto pt-20">
          <h2 className="text-2xl font-bold mb-6 text-center">Tech Services</h2>
    
          {items.length === 0 && <p>No Tech Services available.</p>}
    
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
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
    
                {/* DESCRIPTION */}
                {item.description && (
                  <p className="text-sm text-gray-700 mb-1">
                    {item.description}
                  </p>
                )}
    
                {/* LOCATION */}
                {item.location && (
                  <p className="text-sm text-gray-700 mb-1">
                    📍 {item.location}
                  </p>
                )}
    
                {/* PHONE (clickable) */}
                {item.phone && (
                  <p className="text-sm text-blue-600 font-semibold mb-2">
                    📞 <a href={`tel:${item.phone}`} className="underline">
                      {item.phone}
                    </a>
                  </p>
                )}
    
                {/* RATING */}
                <div className="mt-2 flex items-center gap-2">
                  <Stars value={Number(item.rating || 0)} />
                  <span className="text-sm text-gray-600">
                    ({item.rating ?? 0})
                  </span>
                </div>
    
              </div>
            ))}
          </div>
          <ChatWind />
        </div>
  );
}
