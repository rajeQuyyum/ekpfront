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

    <div className="flex flex-col justify-center items-center mx-2 com">
      <h1 className="text-2xl font-bold mb-5">Connecting people with professionals can be a valuable service. Let's explore this idea further:
         </h1>

         <div className="mb-2">
          <h1 className="mb-4">Key Features:</h1>
         <p className="mb-4">1. Professional Directory: Create a comprehensive directory of professionals in various fields (e.g., real estate, engineering, logistics).
       </p>
         <p className="mb-4">2. Search and Filter: Allow users to search for professionals based on location, services, ratings, and other relevant criteria.
        </p>
         <p className="mb-4">3. Reviews and Ratings: Enable users to leave reviews and ratings for professionals they've worked with.
         </p>
         <p className="mb-4">4. Booking and Scheduling: Allow users to book appointments or schedule services directly through the platform.
        </p>
         <p className="mb-4">5. Payyment Processing: Integrate a secure payment system to facilitate transactions between users and professionals.
      </p>
         </div>

         <div className="flex flex-col gap-2 mb-5">
          <h1  className="">Benefits:
           </h1>
           <p>1. Convenience: Users can easily find and connect with professionals in various fields.
           </p>
           <p>2. Trust: Reviews and ratings help users make informed decisions about which professionals to work with.

         </p>
         <p>3. Increased Exposure: Professionals can showcase their services and reach a broader audience.

        </p>
         </div>

         <div className="flex flex-col gap-2 mb-5">
          <h1>Potential Revenue Streams:
         </h1>
         <p>1.⁠ ⁠Commission-based Booking Fees: Charge professionals a fee for each booking made through the platform.
       </p>
       <p>2.⁠ ⁠Subscription Model: Offer professionals a subscription-based model for premium services, such as increased visibility or priority listing.
      </p>
      <p>3.⁠ ⁠Advertising: Display targeted ads from relevant businesses or professionals.
      </p>

         </div>

         <div  className="flex flex-col gap-2 mb-5">
          <h1>Next Steps:
         </h1>
         <p>1.⁠ ⁠Identify Target Markets: Determine which industries or professions to focus on initially.
         </p>
         <p>2.⁠ ⁠Develop a User-Friendly Platform: Design a website or app that is easy to navigate and provides a seamless user experience.
        </p>
        <p>3.⁠ ⁠Recruit Professionals: Reach out to professionals in your target markets and invite them to join your platform.</p>
         </div>
    </div>
      <ChatWind />
    </div>
  );
}
