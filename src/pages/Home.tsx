import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-sky-400 via-sky-300 to-green-600">
      {/* Header Section */}
      <header className="flex flex-col items-center text-center pt-12 px-6 space-y-4">
        <img
          src="/logo.png"
          alt="DHMS logo"
          className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-contain shadow-2xl bg-white p-3"
        />

        <div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-lg">
            DHMS
          </h1>
          <p className="text-white text-lg sm:text-xl drop-shadow">
            Dairy Herd Management System
          </p>
          <p className="text-white/90 text-base sm:text-lg italic drop-shadow-sm mt-1">
            Track, analyze, and optimize your dairy operations{" "}
          </p>
        </div>
      </header>

      {/* Middle Spacer (push silhouettes & button down to ~3/4) */}
      <div className="flex-1" />

      {/* Cow Silhouettes */}
      <div className="w-full px-6 pb-8">
        <div className="max-w-2xl mx-auto flex justify-between items-end">
          <img
            src="/cow-silhouette1.svg"
            alt="Cow silhouette"
            className="h-14 w-18 opacity-70"
          />
          <img
            src="/cow-silhouette1.svg"
            alt="Cow silhouette"
            className="h-12 w-16 opacity-70 scale-x-[-1]"
          />
          <img
            src="/cow-silhouette1.svg"
            alt="Cow silhouette"
            className="h-14 w-18 opacity-70"
          />
          <img
            src="/cow-silhouette1.svg"
            alt="Cow silhouette"
            className="h-16 w-20 opacity-70 scale-x-[-1]"
          />
        </div>
      </div>

      {/* Login Button */}
      <div className="pb-12 text-center">
        <Button
          onClick={() => navigate("/login")}
          className="w-64 bg-white text-green-700 hover:bg-green-50 py-4 h-auto rounded-full text-xl font-bold uppercase tracking-wider shadow-2xl transition-all transform hover:scale-105"
        >
          LOG IN
        </Button>
      </div>
    </div>
  );
}
