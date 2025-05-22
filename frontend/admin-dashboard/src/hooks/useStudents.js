import { useState, useEffect, useCallback, useMemo } from "react";
import { useFirebase } from "../context/FirebaseContext";
import { useAuth } from "../context/AuthContext";

// Custom hook for managing student data
export const useStudents = () => {
  const { getCollection, createDoc, updateDocData, deleteDocData } =
    useFirebase(); // Firebase functions
  const { currentUser } = useAuth(); // Auth context to get current user
  const [students, setStudents] = useState([]); // State to store student data
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error state

  // Clear error after 5 seconds
  const clearError = useCallback(() => {
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Subscribe to real-time student data updates
  useEffect(() => {
    if (!currentUser?.uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Subscribe to student collection updates
      const unsubscribe = getCollection(
        "students",
        (data) => {
          setStudents(data);
          setLoading(false);
        },
        { orderByField: "name" },
        (error) => {
          setError({
            message: "Failed to load students",
            details: error.message,
          });
          setLoading(false);
          clearError();
        }
      );

      // Cleanup function to unsubscribe from the listener
      return () => unsubscribe();
    } catch (error) {
      setError({
        message: "Failed to initialize student listener",
        details: error.message,
      });
      setLoading(false);
      clearError();
    }
  }, [getCollection, currentUser, clearError]);

  // Adds a new student
  const addStudent = useCallback(
    async (studentData) => {
      if (!currentUser?.uid) {
        const error = new Error("User must be logged in to add students");
        setError({
          message: "Authentication required",
          details: error.message,
        });
        clearError();
        throw error;
      }

      try {
        setLoading(true);
        setError(null);

        const newStudent = {
          ...studentData,
          createdAt: new Date().toISOString(),
          createdBy: currentUser.uid,
          updatedAt: new Date().toISOString(),
          updatedBy: currentUser.uid,
        };

        const studentId = await createDoc("students", newStudent);
        return studentId;
      } catch (error) {
        setError({
          message: "Failed to add student",
          details: error.message,
        });
        clearError();
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [createDoc, currentUser, clearError]
  );

  // Update an existing student
  const editStudent = useCallback(
    async (studentId, updates) => {
      if (!currentUser?.uid) {
        const error = new Error("User must be logged in to edit students");
        setError({
          message: "Authentication required",
          details: error.message,
        });
        clearError();
        throw error;
      }

      try {
        setLoading(true);
        setError(null);

        await updateDocData("students", studentId, {
          ...updates,
          updatedAt: new Date().toISOString(),
          updatedBy: currentUser.uid,
        });
      } catch (error) {
        setError({
          message: "Failed to update student",
          details: error.message,
        });
        clearError();
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [updateDocData, currentUser, clearError]
  );

  // Delete a student
  const removeStudent = useCallback(
    async (studentId) => {
      try {
        setLoading(true);
        setError(null);

        await deleteDocData("students", studentId);
      } catch (error) {
        setError({
          message: "Failed to delete student",
          details: error.message,
        });
        clearError();
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [deleteDocData, clearError]
  );

  // Get student by ID
  const getStudentById = useCallback(
    (id) => {
      return students.find((student) => student.id === id);
    },
    [students]
  );

  // Memoized map of students by ID for quick lookup
  const studentsById = useMemo(() => {
    return students.reduce((map, student) => {
      map[student.id] = student;
      return map;
    }, {});
  }, [students]);

  return {
    students,
    loading,
    error,
    addStudent,
    editStudent,
    removeStudent,
    getStudentById,
    studentsById,
  };
};
