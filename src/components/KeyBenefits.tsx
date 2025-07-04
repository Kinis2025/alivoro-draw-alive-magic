import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Gift, Zap, Clock } from 'lucide-react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebaseConfig";

const KeyBenefits = ({ onLoginClick }: { onLoginClick: () => void }) => {
  const [user] = useAuthState(auth);

  const benefits = [
    {
      icon: Sparkles,
      title: "Spark Creativity",
      description: "Make your child's imagination real and inspire endless artistic possibilities.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Gift,
      title: "Memorable Gifts",
      description: "Turn drawings into unforgettable keepsakes that families will treasure forever.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: Zap,
      title: "AI-Powered Magic",
      description: "State-of-the-art video generation models for incredible realism or cartoon style.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Clock,
      title: "Fast & Easy",
      description: "Videos ready within minutes with just a few simple clicks.",
      color: "from-green-500 to-green-600"
    }
  ];

  const handleTryNowClick = () => {
    if (user) {
      const uploadSection = document.getElementById("upload");
      if (uploadSection) {
        uploadSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      onLoginClick();
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Alivoro?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the magic that makes Alivoro the perfect choice for bringing creativity to life
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group border-0 bg-white/70 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${benefit.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-16 p-8 bg-white/70 backdrop-blur-sm rounded-2xl">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🌟</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            "Your child's artwork deserves to come alive."
          </h3>
          <p className="text-xl text-gray-600 mb-6">
            Try the future of creativity today.
          </p>
          <button
            onClick={handleTryNowClick}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Try Alivoro Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default KeyBenefits;
