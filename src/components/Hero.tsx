import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { Sparkles, Heart, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Logged out successfully");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-20 px-4">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium">AI-Powered Magic</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Bring Your Child's
          <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent block">
            Drawing to Life
          </span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
          Turn imagination into magical moving stories.
        </p>

        <p className="text-lg mb-10 text-white/80 max-w-2xl mx-auto">
          Upload your child's drawing and watch it transform into a stunning animated video within minutes.
        </p>

        {/* Get Started button */}
        <a
          href="#upload"
          className="inline-flex items-center bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
        >
          <Heart className="w-5 h-5 mr-2" />
          Get Started
        </a>

        {/* Login button */}
        <div className="mt-4">
          <Link
            to="/login"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Login
          </Link>
        </div>

        {/* Logout button */}
        <div className="mt-4">
          <button
            onClick={handleLogout}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 text-lg px-6 py-3 rounded-full font-semibold shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>

        <div className="mt-12 flex justify-center space-x-8 text-sm text-white/70">
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Easy creation
          </div>
          <div className="flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
            Videos ready in minutes
          </div>
        </div>
      </div>

      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-300/20 rounded-full blur-xl animate-bounce"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-xl animate-pulse"></div>
      <div
        className="absolute top-40 right-20 w-16 h-16 bg-blue-300/20 rounded-full blur-xl animate-bounce"
        style={{ animationDelay: "1s" }}
      ></div>
    </section>
  );
};

export default Hero;
