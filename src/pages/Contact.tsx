import React from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Mail className="w-12 h-12 text-pink-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Get in Touch
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Have questions, suggestions, or feedback? We'd love to hear from you!
        </p>

        <div className="bg-white shadow-xl rounded-3xl p-10 border border-pink-100">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            📬 Contact Email
          </h2>
          <p className="text-gray-700 text-lg mb-6">
            Please reach out to us at:
          </p>
          <a
            href="mailto:alivorolive@gmail.com"
            className="text-pink-600 text-lg font-bold underline hover:text-pink-700"
          >
            alivorolive@gmail.com
          </a>

          <div className="mt-10">
            <Button
              onClick={() => (window.location.href = "/")}
              className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-900 transition-colors font-semibold"
            >
              🔙 Back to Home
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
