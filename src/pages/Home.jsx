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

   <div className="flex flex-col justify-center md:ml-40 gap-3 ml-0 px-2 md:px-0">
    <h1>What We Do
      </h1>
      <p>At Leposavas Proftech, we connect professionals with clients within their location, facilitating collaborations and opportunities that drive business growth and innovation in the following industries:</p>
      <p>•⁠  ⁠Real Estate: We link professionals such as property managers, real estate agents, and contractors with clients seeking expertise in property development, management, and transactions.</p>
      <p>⁠E-commerce: Our network enables ecommerce businesses to find professionals with expertise in digital marketing, logistics, and technology, helping them scale and succeed</p>
      <p>•⁠  ⁠Engineering: We connect engineering professionals with clients seeking expertise in fields such as electrical engineering, mechanical engineering, and project management.</p>
      
     
      <h1>Our Mission:</h1>
      <p>Our mission is to empower professionals and organizations in these industries by facilitating meaningful connections that lead to successful collaborations and business growth.</p>
      <p>How We Help</p>
      <p>•⁠  ⁠Professional Networking: We provide a platform for professionals to showcase their skills and connect with potential clients.</p>
      <p>•⁠  ⁠Client Matching: Our network enables clients to find and engage with professionals who meet their specific needs.</p>
      <p>•⁠  ⁠Local Innovation: By fostering connections between professionals and clients, we contribute to the growth of local economies and innovation ecosystems.</p>

   </div>
    
      <ChatWind />
    </div>
  );
}
