import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";

export const saveVideo = async (videoUrl: string, title: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  await addDoc(collection(db, "videos"), {
    userId: user.uid,
    videoUrl,
    title,
    createdAt: serverTimestamp(),
  });
};
