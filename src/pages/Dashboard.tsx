import React, { useEffect, useState } from "react";
import { auth, db } from "@/firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import UploadSection from "@/components/UploadSection";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setUser(currentUser);

      // 🔥 Fetch user credits from Firestore (if you implement credits)
      const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", currentUser.uid)));
      if (!userDoc.empty) {
        setCredits(userDoc.docs[0].data().credits || 0);
      }

      // 🔥 Fetch user videos
      const q = query(collection(db, "videos"), where("userId", "==", currentUser.uid));
      const snapshot = await getDocs(q);
      const videoList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setVideos(videoList);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
        <button onClick={handleLogout} className="text-purple-600 underline">Logout</button>
      </div>

      <div className="bg-gray-100 p-4 rounded shadow text-lg">
        💰 Credits: <span className="font-bold">{credits}</span>
      </div>

      {/* Upload form */}
      <UploadSection />

      {/* Videos list */}
      <div>
        <h2 className="text-2xl font-bold mb-4">My Videos</h2>
        {videos.length === 0 ? (
          <p>You have no generated videos yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map(video => (
              <div key={video.id} className="border rounded p-4 shadow">
                {video.videoUrl ? (
                  <video src={video.videoUrl} controls className="w-full mb-2" />
                ) : (
                  <p>No video URL available.</p>
                )}
                <p className="text-sm text-gray-600">
                  Created at: {video.createdAt?.seconds ? new Date(video.createdAt.seconds * 1000).toLocaleString() : "Unknown"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
