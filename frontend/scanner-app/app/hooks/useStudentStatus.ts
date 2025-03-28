import { useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../FirebaseConfig";

// Custom hook to update student status
export const useStudentStatus = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to update student status
  const updateStudentStatus = async (
    studentID: string,
    newStatus: "Present" | "Absent"
  ) => {
    setLoading(true);
    setError(null);
    try {
      // Update student status in Firestore
      const studentRef = doc(db, "students", studentID);
      await updateDoc(studentRef, { status: newStatus });
      return true;
    } catch (err) {
      setError("Failed to update student status");
      console.log(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Function to get student data
  const getStudentData = async (studentID: string) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch student data from Firestore
      const studentRef = doc(db, "students", studentID);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        setError("Student not found");
        return null;
      }
      return studentSnap.data() as {
        name: string;
        status: "Present" | "Absent";
      };
    } catch (err) {
      setError("Failed to fetch student data");
      console.log(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updateStudentStatus, getStudentData, loading, error };
};
