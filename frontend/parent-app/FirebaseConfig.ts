import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const app = initializeApp(firebaseConfig);

// Initializing Firebase Auth with AsyncStorage for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };