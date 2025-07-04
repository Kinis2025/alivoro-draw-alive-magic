import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebaseConfig";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import KeyBenefits from "../components/KeyBenefits";
import UploadSection from "../components/UploadSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Index = () => {
  const [user, loading] = useAuthState(auth);

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
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </div>
      )}

      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
