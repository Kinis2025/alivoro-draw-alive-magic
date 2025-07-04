import React, { useEffect, useState } from "react";
import { auth } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // db = getFirestore(app) Firebase instance

const Dashboard = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "videos"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const videoList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videoList);
      setLoading(false);
    };

    fetchVideos();
  }, []);

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Videos</h1>
      {videos.length === 0 ? (
        <p>You have no generated videos yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="border rounded p-4 shadow">
              <video src={video.videoUrl} controls className="w-full mb-2" />
              <p className="text-sm text-gray-600">
                Created at: {new Date(video.createdAt.seconds * 1000).toLocaleString()}
              </p>
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
