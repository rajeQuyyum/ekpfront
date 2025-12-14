// src/Components/DelayedLink.js
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DelayedLink({ to, children, className, delay = 800 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();

    // If you're already on the page, don't delay
    if (location.pathname === to) return navigate(to);

    setLoading(true);

    setTimeout(() => {
      navigate(to);
    }, delay);
  };

  // 💡 When route changes, stop loading automatically
  useEffect(() => {
    setLoading(false);
  }, [location.pathname]);

  return (
    <>
      <span
        onClick={handleClick}
        className={className}
        style={{ cursor: "pointer" }}
      >
        {children}
      </span>

      {loading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center 
                        bg-black bg-opacity-60 backdrop-blur-sm z-50 transition-all">

          <div className="w-14 h-14 border-4 border-white border-t-transparent rounded-full animate-spin"></div>

          <p className="text-white mt-4 text-xl animate-pulse">
            Loading... please wait
          </p>
        </div>
      )}
    </>
  );
}
