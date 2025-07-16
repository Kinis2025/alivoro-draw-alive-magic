import React from "react";
import { Button } from "@/components/ui/button";
import { BadgeEuro } from "lucide-react";

const Pricing = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <BadgeEuro className="w-12 h-12 text-purple-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Simple & Transparent Pricing
        </h1>
        <p className="text-lg text-gray-700 mb-10">
          Just one price, no subscriptions, no hidden fees.
        </p>

        <div className="bg-white shadow-xl rounded-3xl p-10 border border-purple-100">
          <h2 className="text-3xl font-extrabold text-purple-700 mb-4">
            🎬 One Animated Video
          </h2>
          <p className="text-gray-700 text-lg mb-2">
            ✅ Duration: <strong>5 seconds</strong>
          </p>
          <p className="text-gray-700 text-lg mb-6">
            ✅ Price: <strong>2 EUR</strong> (one-time payment)
          </p>

          <Button
            onClick={() => (window.location.href = "/#upload")}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold"
          >
            🎨 Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
