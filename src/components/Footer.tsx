import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => {
  const links = [
    { title: "About", to: "#about" },
    { title: "Pricing", to: "#pricing" },
    { title: "Contact", to: "#contact" },
    { title: "Terms of Service", to: "/terms" },
    { title: "Privacy Policy", to: "/privacy" },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Alivoro
          </h3>
          <p className="text-gray-400 mt-2">
            Bringing imagination to life, one drawing at a time
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-8">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="text-gray-400 hover:text-white transition-colors duration-200 hover:underline"
            >
              {link.title}
            </Link>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center">
            Made with <Heart className="w-4 h-4 text-red-500 mx-2" /> for
            creative families everywhere
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2024 Alivoro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
