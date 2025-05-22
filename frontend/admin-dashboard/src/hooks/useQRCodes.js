// src/hooks/useStudentQRCode.js
import { useState, useEffect } from "react";
import { useFirebase } from "../context/FirebaseContext";
import { doc, onSnapshot } from "firebase/firestore";

// Custom hook for managing QR codes for students
export const useQRCodes = (studentId) => {
  const { db } = useFirebase();
  const [qrCodeUrl, setQrCodeUrl] = useState(null); // State to store the QR code URL
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state

  // Setting up QR code listener
  useEffect(() => {
    if (!studentId || !db) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const qrCodeRef = doc(db, "qr_codes", studentId);

      // Subscribe to real-time updates for the QR code document
      const unsubscribe = onSnapshot(
        qrCodeRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setQrCodeUrl(data.qr_code_url);
          } else {
            setQrCodeUrl(null);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching QR code:", error);
          setError("Failed to load QR code");
          setLoading(false);
        }
      );

      // Cleanup function to unsubscribe from the listener
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up QR code listener:", error);
      setError("Failed to initialize QR code listener");
      setLoading(false);
    }
  }, [db, studentId]);

  return { qrCodeUrl, loading, error };
};
