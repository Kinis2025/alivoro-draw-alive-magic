
import React from 'react';
import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import KeyBenefits from '../components/KeyBenefits';
import UploadSection from '../components/UploadSection';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <Hero />
      <HowItWorks />
      <KeyBenefits />
      <UploadSection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
