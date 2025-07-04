import React, { useEffect, useState } from "react";

const Success = () => {
  const [status, setStatus] = useState("Generating your video...");

  useEffect(() => {
    const generateVideo = async () => {
      try {
        const formData = new FormData();
        // ✅ izmanto URL, nevis File
        formData.append("imageUrl", localStorage.getItem("uploadedImageUrl") || "");
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

        if (data.video_url) {
          setStatus("✅ Video generated! Click below to download.");
          // 👉 šeit vari setot state un parādīt download pogu
        } else {
          setStatus("❌ Video generation failed. Please try again.");
        }

      } catch (error) {
        console.error("Error generating video after payment:", error);
        setStatus("❌ Error generating video. Please contact support.");
      }
    };

    generateVideo();
  }, []);

  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg">{status}</p>
      {/* TODO: download button if video_url exists */}
    </div>
  );
};

export default Success;
