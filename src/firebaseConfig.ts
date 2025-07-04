import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCxVKrh9Lf_0Kv71P-aFUSMNPjGTfVNOP0",
  authDomain: "alivoro.firebaseapp.com",
  projectId: "alivoro",
  storageBucket: "alivoro.appspot.com",
  messagingSenderId: "176947871728",
  appId: "1:176947871728:web:6aef69d79b960da2cda735",
  measurementId: "G-HV62PYSRDX",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
