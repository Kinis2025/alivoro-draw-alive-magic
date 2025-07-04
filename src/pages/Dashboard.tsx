import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

interface Video {
  id: string;
  title?: string;
  url?: string;
  createdAt?: any;
}

const Dashboard = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setError("You must be logged in to view your videos.");
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "videos"),
          where("userId", "==", user.uid)
        );

        const querySnapshot = await getDocs(q);
        const videoList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Video[];

        setVideos(videoList);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError("Failed to load videos. Please try again later.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Videos</h1>

      {videos.length === 0 ? (
        <p>You have no generated videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="border rounded p-4 shadow">
              {video.url ? (
                <video src={video.url} controls className="w-full mb-2" />
              ) : (
                <p>No video URL available.</p>
              )}

              <p className="text-lg font-semibold">{video.title || "Untitled"}</p>

              {video.createdAt && video.createdAt.seconds ? (
                <p className="text-sm text-gray-600">
                  Created at:{" "}
                  {new Date(video.createdAt.seconds * 1000).toLocaleString()}
                </p>
              ) : (
                <p className="text-sm text-gray-600">No creation date.</p>
              )}

              {video.url && (
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-600 underline"
                >
                  Download
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
