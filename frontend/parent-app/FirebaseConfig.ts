import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDWYIm_v8AMq4rGH26yCAkIBUTF2Mqvns",
  authDomain: "stem-attendance-system.firebaseapp.com",
  projectId: "stem-attendance-system",
  storageBucket: "stem-attendance-system.firebasestorage.app",
  messagingSenderId: "829210791998",
  appId: "1:829210791998:web:03bd1863fc1ec71083016f",
  measurementId: "G-KJMEL7515K",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
