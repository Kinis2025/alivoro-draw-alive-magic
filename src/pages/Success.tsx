import React, { useEffect, useState } from "react";

const Success = () => {
  const [status, setStatus] = useState("Generating your video...");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateVideo = async () => {
      try {
        const payload = {
          imageUrl: localStorage.getItem("uploadedImageUrl"),
          action: localStorage.getItem("action"),
          environment: localStorage.getItem("environment"),
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
          setStatus("✅ Video generated! Click below to watch or download.");
          setVideoUrl(data.video_url);
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
    <div className="text-center py-20 px-4">
      <h1 className="text-4xl font-bold mb-4 text-purple-700">Payment Successful!</h1>
      <p className="text-lg">{status}</p>

      {videoUrl && (
        <div className="mt-8">
          <video
            controls
            src={videoUrl}
            className="mx-auto rounded-lg mb-4 max-w-full w-[90%] md:w-[500px]"
          />
          <a
            href={videoUrl}
            download="my-generated-video.mp4"
            className="inline-block bg-purple-600 text-white px-6 py-3 rounded-full hover:bg-purple-700 transition-colors font-semibold"
          >
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default Success;
