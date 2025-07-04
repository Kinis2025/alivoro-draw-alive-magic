import React, { useEffect } from "react";

const Success = () => {
  useEffect(() => {
    const generateVideo = async () => {
      try {
        const formData = new FormData();
        // 👇 šeit ieliec reālos datus no localStorage vai context (kas tika ievadīti pirms apmaksas)
        formData.append("image", localStorage.getItem("uploadedImageFile"));
        formData.append("action", localStorage.getItem("action") || "");
        formData.append("environment", localStorage.getItem("environment") || "");
        formData.append("duration", localStorage.getItem("duration") || "5");
        formData.append("ratio", localStorage.getItem("ratio") || "720:1280");

        const response = await fetch("https://YOUR_RENDER_BACKEND_URL/api/generate", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("Generated video:", data);
      } catch (error) {
        console.error("Error generating video after payment:", error);
      }
    };

    generateVideo();
  }, []);

  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg">Your video is being generated. Please wait...</p>
      {/* Vari ielikt loader animāciju */}
    </div>
  );
};

export default Success;
