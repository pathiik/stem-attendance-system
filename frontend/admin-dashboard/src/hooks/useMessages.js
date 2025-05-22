import { useState, useEffect, useCallback } from "react";
import { useFirebase } from "../context/FirebaseContext";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

// Custom hook for managing messages with real-time updates
export const useMessages = () => {
  const { db } = useFirebase();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Setting up rela-time message listener
  useEffect(() => {
    if (!currentUser?.uid || !db) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Query messages ordered by creation date (newest first)
      const messagesQuery = query(
        collection(db, "messages"),
        orderBy("created_at", "desc")
      );

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(
        messagesQuery,
        (querySnapshot) => {
          const messagesData = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              // Convert Firestore timestamp to JS Date if needed
              created_at: data.created_at?.toDate() || data.created_at,
            };
          });
          setMessages(messagesData);

          // Calculate unread message count
          const unread = messagesData.filter(
            (msg) => msg.status === "unread"
          ).length;
          setUnreadCount(unread);
          setLoading(false);
        },
        (error) => {
          console.error("Firestore error:", error);
          setError({
            message: "Failed to load messages",
            details: error.message,
          });
          setLoading(false);
        }
      );
      // Cleanup function to unsubscribe when component unmounts
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up message listener:", error);
      setError({
        message: "Failed to initialize message listener",
        details: error.message,
      });
      setLoading(false);
    }
  }, [db, currentUser]);

  // Marks a message as read
  const markMessageAsRead = useCallback(
    async (messageId) => {
      if (!db || !messageId) return;

      try {
        const messageRef = doc(db, "messages", messageId);
        await updateDoc(messageRef, {
          status: "read",
          read_at: serverTimestamp(), // Use server timestamp for consistency
          read_by: currentUser?.uid,
        });
      } catch (error) {
        console.error("Error marking message as read:", error);
        setError({
          message: "Failed to mark message as read",
          details: error.message,
        });
        throw error;
      }
    },
    [db, currentUser?.uid]
  );

  // Converts a message to a task
  const addMessageToTasks = useCallback(
    async (messageId) => {
      if (!db || !messageId) return;

      try {
        const messageRef = doc(db, "messages", messageId);
        await updateDoc(messageRef, {
          status: "new_task",
          converted_at: serverTimestamp(),
          converted_by: currentUser?.uid,
        });
      } catch (error) {
        console.error("Error converting message to task:", error);
        setError({
          message: "Failed to convert message to task",
          details: error.message,
        });
        throw error;
      }
    },
    [db, currentUser?.uid]
  );

  return {
    messages,
    loading,
    error,
    markMessageAsRead,
    addMessageToTasks,
    unreadCount,
  };
};
