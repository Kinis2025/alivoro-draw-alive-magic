import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebaseConfig";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import KeyBenefits from "../components/KeyBenefits";
import UploadSection from "../components/UploadSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Index = () => {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (window.location.hash === "#upload") {
      const scrollToUpload = () => {
        const element = document.getElementById("upload");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      };

      // Mazs timeout, lai pārliecinātos, ka UploadSection ir renderēts
      setTimeout(scrollToUpload, 500);
    }
  }, [user]); // <- triggerējas, kad lietotāja state mainās

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Hero />
      <HowItWorks />
      <KeyBenefits />

      {loading ? (
        <div className="text-center my-8">Loading...</div>
      ) : user ? (
        <UploadSection />
      ) : null}

      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
