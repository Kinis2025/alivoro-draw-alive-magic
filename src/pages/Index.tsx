import React, { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebaseConfig";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import KeyBenefits from "../components/KeyBenefits";
import UploadSection from "../components/UploadSection";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";

const Index = () => {
  const [user, loading] = useAuthState(auth);
  const [loginOpen, setLoginOpen] = useState(false);

  // Kad lietotājs ielogojas, automātiski scroll uz Upload sekciju
  useEffect(() => {
    if (user) {
      const uploadSection = document.getElementById("upload");
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Hero onLoginClick={() => setLoginOpen(true)} />
      <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />

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
