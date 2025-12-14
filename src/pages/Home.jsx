import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import ChatWind from "./ChatWidget";
import { api } from "../utils/api";
import DelayedLink from "../components/DelayedLink";

export default function Home() {
  const [showRenters, setShowRenters] = useState(false);

  const [adverts, setAdverts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadAdverts = async () => {
    try {
      const res = await api.get("/adverts");
      setAdverts(res.data.adverts || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadAdverts();
  }, []);

  useEffect(() => {
    if (adverts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev + 1 < adverts.length ? prev + 1 : 0
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [adverts]);

  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-4">Welcome to LEPO</h1>

      {/* ROTATING ADVERT */}
{adverts.length > 0 && (
  <div className="mt-4 overflow-hidden">
    <h1 className="font-extrabold">Advert</h1>

    <div className="text-lg font-semibold text-white bg-black md:w-[600px] w-full m-auto p-3 rounded transition-all duration-500 ease-in-out">
      <div
        key={adverts[currentIndex]._id}
        className="flex flex-col text-center animate-fadeAdvert items-center"
      >
        {/* IMAGE */}
        {adverts[currentIndex].imageUrl && (
          <img
            src={adverts[currentIndex].imageUrl}
            alt="advert"
            className="w-32 h-32 object-cover rounded mb-2 shadow-md"
          />
        )}

        {/* NAME */}
        <span>{adverts[currentIndex].name}</span>

        {/* DESCRIPTION */}
        <span>{adverts[currentIndex].description}</span>

        {/* Location */}
        <span className="text-sm text-gray-500">
          📍 {adverts[currentIndex].location}
        </span>

        {/* Phone CLICKABLE */}
        <a
          href={`tel:${adverts[currentIndex].phone}`}
          className="text-sm text-blue-700 underline font-bold mt-1"
        >
          📞 {adverts[currentIndex].phone}
        </a>
      </div>
    </div>
  </div>
)}

      {/* ORIGINAL MARQUEE */}
      <div className="mt-6 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-lg font-semibold text-blue-600">
          🚗 Rent Cars • 🛠 Engineering Services • 🏠 Home Services • 💻 Tech Services • 🏨 Hotels & Apartments • 24/7 Support 🚀
        </div>
      </div>

      <div className="flex flex-col gap-2 items-center mt-10">
        <DelayedLink to="/ele" className="text-xl font-semibold hover:text-amber-400 list-item">
          Engineering Services
        </DelayedLink>

        <DelayedLink to="/tech" className="text-xl font-semibold hover:text-amber-400 list-item">
          Tech Services
        </DelayedLink>

        <DelayedLink to="/ser" className="text-xl font-semibold hover:text-amber-400 list-item">
          Home Services
        </DelayedLink>

        <div>
          <button
            onClick={() => setShowRenters(!showRenters)}
            className="text-xl font-semibold hover:text-amber-400"
          >
            Renters Services ▼
          </button>

          {showRenters && (
            <div className="flex flex-col mt-3 animate-fadeIn">
              <DelayedLink to="/car" className="hover:text-red-500">Cars</DelayedLink>
              <DelayedLink to="/house" className="hover:text-red-500">House/Hostels</DelayedLink>
              <DelayedLink to="/hostel" className="hover:text-red-500">Hotel/Appartment</DelayedLink>
            </div>
          )}
        </div>
      </div>

      <ChatWind />
    </div>
  );
}
