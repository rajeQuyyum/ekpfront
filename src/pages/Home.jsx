import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import ChatWind from "./ChatWidget";
import { api } from "../utils/api";
import DelayedLink from "../components/DelayedLink";

export default function Home() {

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
    <div className=" py-20">
      <h1 className="text-3xl text-center font-bold mb-4">Leposavas ProfTech</h1>

      {/* ROTATING ADVERT */}
{adverts.length > 0 && (
  <div className="mt-4 overflow-hidden">
    <h1 className="font-extrabold text-center mb-3">Advert</h1>

    <div className="text-lg font-semibold text-white bg-black md:w-[300px] md:h-[350px] h-[300px] w-[250px] m-auto p-3 rounded transition-all duration-500 ease-in-out">
      <div
        key={adverts[currentIndex]._id}
        className="flex flex-col text-center animate-fadeAdvert items-center"
      >
        {/* IMAGE */}
        {adverts[currentIndex].imageUrl && (
          <img
            src={adverts[currentIndex].imageUrl}
            alt="advert"
            className="md:w-[600px] w-full  object-cover rounded mb-2 shadow-md"
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
      <div className="mt-6 overflow-hidden mb-5">
        <div className="animate-marquee whitespace-nowrap text-lg font-semibold text-blue-600">
          🚗 Rent Cars • 🛠 Engineering Services • 🏠 Home Services • 💻 Tech Services • 🏨 Hotels & Apartments • 24/7 Support 🚀
        </div>
      </div>

   
    
      <ChatWind />
    </div>
  );
}
