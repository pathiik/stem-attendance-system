import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../FirebaseConfig";

export const useStudents = () => {
  const [parentName, setParentName] = useState<string | null>(null);
  const [studentDetails, setStudentDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeParent = () => {};

    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setParentName(null);
      setStudentDetails([]);
      setLoading(true);

      if (!user?.email) {
        setLoading(false);
        return;
      }

      const parentEmail = user.email;
      const parentDocRef = doc(db, "parents", parentEmail);

      unsubscribeParent = onSnapshot(parentDocRef, (parentDocSnap) => {
        // Check if parent document exists
        if (!parentDocSnap.exists()) {
          setLoading(false);
          return;
        }

        // Get parent data and set parent name
        const parentData = parentDocSnap.data();
        const firstName = parentData.parent_name.split(" ")[0];
        setParentName(firstName || "Parent");

        if (!Array.isArray(parentData.children)) {
          setLoading(false);
          return;
        }

        setStudentDetails([]); // Clear existing student data

        const studentUnsubscribers = parentData.children.map((child) => {
          const studentDocRef = doc(
            db,
            "students",
            child.student_id.toString()
          );

          return onSnapshot(studentDocRef, (studentDocSnap) => {
            if (studentDocSnap.exists()) {
              setStudentDetails((prev) => {
                // Check if student already exists
                const exists = prev.some(
                  (s) => s.student_id === studentDocSnap.data().student_id
                );
                if (exists) {
                  // Update existing student
                  return prev.map((s) =>
                    s.student_id === studentDocSnap.data().student_id
                      ? studentDocSnap.data()
                      : s
                  );
                } else {
                  // Add new student
                  return [...prev, studentDocSnap.data()];
                }
              });
            }
          });
        });
        setLoading(false); // Data loaded (disable loading spinner)
        return () => studentUnsubscribers.forEach((unsub) => unsub());
      });
    });

    return () => {
      unsubscribeAuth();
      unsubscribeParent();
    };
  }, []);

  return { parentName, studentDetails, loading };
};
