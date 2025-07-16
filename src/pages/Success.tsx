import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const Success = () => {
  const [status, setStatus] = useState("⏳ PLEASE WAIT WHILE YOUR VIDEO IS BEING GENERATED. DO NOT CLOSE THIS PAGE!");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateVideo = async () => {
      try {
        const payload = {
          imageUrl: localStorage.getItem("uploadedImageUrl") || "",
          action: localStorage.getItem("action") || "",
          environment: localStorage.getItem("environment") || "",
          duration: localStorage.getItem("duration") || "5",
          ratio: localStorage.getItem("ratio") || "720:1280",
        };

        const response = await fetch("https://alivoro-server.onrender.com/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log("Generated video:", data);

        if (data.video_url) {
          setStatus("✅ VIDEO GENERATED SUCCESSFULLY! YOU CAN DOWNLOAD IT BELOW.");
          setVideoUrl(data.video_url);

          // 🧹 Clear localStorage
          localStorage.removeItem("uploadedImageUrl");
          localStorage.removeItem("action");
          localStorage.removeItem("environment");
          localStorage.removeItem("duration");
          localStorage.removeItem("ratio");
        } else {
          setStatus("❌ VIDEO GENERATION FAILED. PLEASE TRY AGAIN.");
        }
      } catch (error) {
        console.error("Error generating video after payment:", error);
        setStatus("❌ ERROR GENERATING VIDEO. PLEASE CONTACT SUPPORT.");
      }
    };

    generateVideo();
  }, []);

  return (
    <div className="text-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-6">🎉 Payment Successful!</h1>

      <p className="text-xl font-bold text-red-600 uppercase mb-8">
        {status}
      </p>

      {videoUrl && (
        <div className="mb-8">
          <video controls src={videoUrl} className="mx-auto rounded-lg mb-4 max-w-full" />
          <Button
            onClick={() => {
              const link = document.createElement("a");
              link.href = videoUrl;
              link.download = "my-generated-video.mp4";
              link.target = "_blank";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors font-semibold mb-4"
          >
            ⬇️ Download Video
          </Button>

          {/* ✅ Only show this when video is ready */}
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-900 transition-colors font-semibold"
          >
            🔙 Back to Home
          </Button>
        </div>
      )}
    </div>
  );
};

export default Success;
