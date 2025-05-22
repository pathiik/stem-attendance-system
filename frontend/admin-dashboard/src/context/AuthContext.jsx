import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  // To be added in the future (updateEmail, updatePassword)
} from "firebase/auth";

import Spinner from "../components/ui/Spinner";

// Create authentication context
const AuthContext = createContext();

// AuthProvider - Context provider for authentication operations
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Current user state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Clear error messages after a delay of 5 seconds
  const clearError = useCallback(() => {
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Get user-friendly error messages based on error codes
  const getUserFriendlyError = useCallback((error) => {
    const errorCode = error.code || error; // Extracting error code

    // Mapping error codes to user-friendly messages
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "This email is already in use. Please use a different email.";
      case "auth/invalid-email":
        return "The email address is not valid. Please enter a valid email.";
      case "auth/user-not-found":
        return "No user found with this email address. Please try again.";
      case "auth/wrong-password":
        return "The password is incorrect. Please try again.";
      case "auth/weak-password":
        return "The password is too weak. Please choose a stronger password.";
      case "auth/operation-not-allowed":
        return "This operation is not allowed. Please contact support.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
      case "auth/requires-recent-login":
        return "This operation requires recent authentication. Please log in again.";
      case "auth/invalid-credential":
        return "The provided credential is invalid. Please check and try again.";
      default:
        return typeof error === "string"
          ? error
          : "An unknown error occurred. Please try again.";
    }
  }, []);

  // Handles user signup with email and password
  const signup = useCallback(
    async (email, password) => {
      try {
        setLoading(true); // Set loading state to true
        setError(null); // Clear any previous error messages
        return await createUserWithEmailAndPassword(auth, email, password); // Create user with email and password
      } catch (error) {
        setError(getUserFriendlyError(error)); // Set error message
        clearError();
      } finally {
        setLoading(false); // Set loading state to false
      }
    },
    [clearError, getUserFriendlyError]
  );

  // Handles user login with email and password
  const login = useCallback(
    async (email, password) => {
      try {
        setLoading(true); // Set loading state to true
        setError(null); // Clear any previous error messages
        return await signInWithEmailAndPassword(auth, email, password); // Sign in user with email and password
      } catch (error) {
        setError(getUserFriendlyError(error)); // Set error message
        clearError();
      } finally {
        setLoading(false); // Set loading state to false
      }
    },
    [clearError, getUserFriendlyError]
  );

  // Handles user logout
  const logout = useCallback(async () => {
    try {
      setLoading(true); // Set loading state to true
      setError(null); // Clear any previous error messages
      return await signOut(auth); // Sign out the user
    } catch (error) {
      setError(getUserFriendlyError(error)); // Set error message
      clearError();
    } finally {
      setLoading(false); // Set loading state to false
    }
  }, [clearError, getUserFriendlyError]);

  // Sends a password reset email to the user
  const resetPassword = useCallback(
    async (email) => {
      try {
        setLoading(true); // Set loading state to true
        setError(null); // Clear any previous error messages
        return await sendPasswordResetEmail(auth, email); // Send password reset email
      } catch (error) {
        setError(getUserFriendlyError(error)); // Set error message
        clearError();
      } finally {
        setLoading(false); // Set loading state to false
      }
    },
    [clearError, getUserFriendlyError]
  );

  // Subscribe to authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update current user state when auth state changes
      setLoading(false); // Set loading state to false
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  // Context value containing authentication methods and state
  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    getUserFriendlyError,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner size="lg" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

// Custom hook to access the AuthContext
export function useAuth() {
  const context = useContext(AuthContext); // Get the context value
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider"); // Error if context is not available
  }
  return context; // Return the context value
}
