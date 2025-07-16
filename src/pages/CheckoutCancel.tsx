import React from "react";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const CheckoutCancel = () => {
  return (
    <div className="text-center py-20 px-4">
      <div className="flex justify-center items-center mb-6">
        <XCircle className="w-12 h-12 text-pink-500 mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">Payment cancelled</h1>
      </div>
      <p className="text-lg text-gray-700 mb-8">
        Your payment was cancelled. Please try again.
      </p>

      <Button
        onClick={() => (window.location.href = "/")}
        className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-900 transition-colors font-semibold"
      >
        🔙 Back to Home
      </Button>
    </div>
  );
};

export default CheckoutCancel;
