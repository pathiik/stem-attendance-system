// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDWYIm_v8AMq4rGH26yCAkIBUTF2Mqvns",
  authDomain: "stem-attendance-system.firebaseapp.com",
  projectId: "stem-attendance-system",
  storageBucket: "stem-attendance-system.firebasestorage.app",
  messagingSenderId: "829210791998",
  appId: "1:829210791998:web:3e958bb5bef9252083016f",
  measurementId: "G-SL7MFX89S6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
