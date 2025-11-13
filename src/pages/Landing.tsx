import { GiCow } from "react-icons/gi";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { HiArrowTrendingUp } from "react-icons/hi2";

import React from "react";
import { useNavigate } from "react-router-dom";

interface FeatureProps {
  icon: React.ElementType;
  text: string;
  color: string;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 via-green-50 to-amber-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-6 pt-12 md:pt-16">
        <div className="text-center space-y-6">
          {/* Logo/Icon */}
          <div className="mb-4 md:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-800 tracking-tight whitespace-nowrap">
            Dairy Herd Management
            <span className="block text-xl sm:text-4xl md:text-5xl mt-1 sm:mt-2 text-green-700">
              System
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-sm sm:text-xl md:text-2xl text-gray-600 font-light max-w-xs sm:max-w-2xl mx-auto">
            Smart herd management made simple.
          </p>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 md:mt-16">
            <Feature
              icon={HiArrowTrendingUp}
              text="Track Production"
              color="green"
            />
            <Feature icon={GiCow} text="Manage Your Herd" color="grey" />
            <Feature
              icon={MdOutlineHealthAndSafety}
              text="Health Monitoring"
              color="red"
            />
          </div>

          {/* CTA Button */}
          <div className="pt-8">
            <button
              onClick={() => navigate("/signin")}
              className="inline-block px-12 py-4 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Cow Silhouettes */}
      <div className="w-full px-6 pb-4">
        <div className="max-w-2xl mx-auto flex justify-between items-end">
          {[1, 2, 3, 4].map((num) => (
            <img
              key={num}
              src="/cow-silhouette1.svg"
              alt="Cow Silhouette"
              className={`${
                num % 2 === 0 ? "scale-x-[-1]" : ""
              } h-16 w-20 opacity-70`}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-gray-500  overflow-x-auto">
        © {new Date().getFullYear()} Dairy Herd Management System. All rights
        reserved.
      </footer>
    </div>
  );
};

const Feature: React.FC<FeatureProps> = ({ icon: Icon, text, color }) => (
  <div className="flex flex-col items-center space-y-3 text-center">
    <div
      className={`w-12 h-12 bg-${color}-100 rounded-full flex items-center justify-center shadow-md`}
    >
      <Icon className={`h-6 w-6 text-${color}-600`} />
    </div>
    <span className="text-gray-700 font-semibold">{text}</span>
  </div>
);

export default LandingPage;
