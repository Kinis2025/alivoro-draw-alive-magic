import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebaseConfig";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import KeyBenefits from "../components/KeyBenefits";
import UploadSection from "../components/UploadSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal"; // ⬅️ importē LoginModal
import { Heart } from "lucide-react";

const Index = () => {
  const [user, loading] = useAuthState(auth);
  const [showLoginModal, setShowLoginModal] = useState(false); // ⬅️ modal state

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Hero />
      <HowItWorks />
      <KeyBenefits />

      {loading ? (
        <div className="text-center my-8">Loading...</div>
      ) : user ? (
        <UploadSection />
      ) : (
        <div className="text-center my-8">
          <p className="mb-4 text-lg">Please login to generate videos.</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="inline-flex items-center bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            <Heart className="w-5 h-5 mr-2" />
            Get Started
          </button>
        </div>
      )}

      <Testimonials />
      <Footer />

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default Index;
