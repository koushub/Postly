import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";

const Hero = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const handleGetStarted = () => {
    if (token) {
        navigate("/write");
    } else {
        navigate("/login");
    }
  };

  return (
    <div
      className="relative min-h-[70vh] w-full bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://shoppaulzizkaphoto.com/cdn/shop/products/Desktop-1.jpg)",
      }}
    >
      {}
      {theme === "night" && (
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/30 to-black/10"></div>
      )}

      {}
      <div className="relative z-10 flex items-center justify-center min-h-[70vh] text-center text-white">
        <div className="max-w-md px-4">
          <h1
            className="mb-5 text-6xl font-extrabold drop-shadow-2xl"
            style={{ textShadow: "0 4px 8px rgba(0,0,0,0.4)" }}
          >
            Welcome to Postly
          </h1>
          <p
            className="mb-7 text-white text-xl text-heading font-semibold"
            style={{ textShadow: "0 4px 8px rgba(0,0,0,0.9)" }}
          >
            Discover stories, thinking, and expertise from writers on any topic.
          </p>

          <button
            onClick={handleGetStarted}
            className={`btn border-none rounded-full px-8 text-lg font-semibold transition-transform hover:scale-105 shadow-xl cursor-pointer
  ${token ? "bg-primary text-primary-content hover:bg-primary/90" 
           : "bg-white text-black hover:bg-gray-200"}
`}
          >
            {token ? "Write a Post ✍️" : "Get Started"}
          </button>
        </div>
      </div>

      {}
      <div
        className="absolute bottom-0 left-0 right-0 h-[25vh]
        bg-linear-to-b 
        from-transparent 
        via-base-100/80 to-base-100
        "
      ></div>
    </div>
  );
};

export default Hero;
