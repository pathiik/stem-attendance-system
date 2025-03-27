import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../../FirebaseConfig";
import { router } from "expo-router";
import { ROUTES } from "../constants/routes";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null); // State for current user
  const [loading, setLoading] = useState(true); // State for loading state

  // Fetches user data on component mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);

      if (!user) {
        router.push(ROUTES.AUTH); // Redirect to auth screen if no user
      }
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      router.push(ROUTES.AUTH); // Redirect to auth screen after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return { user, loading, logout };
};
