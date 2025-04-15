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

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Current user state
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to clear error messages after a delay of 5 seconds
  const clearError = useCallback(() => {
    const timer = setTimeout(() => setError(null), 5000);
    return () => clearTimeout(timer);
  }, []);

  // Function to return user-friendly error messages based on error codes
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

  // Function to handle new user signup process
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

  // Function to handle user login process
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

  // Function to handle user logout process
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

  // Function to handle password reset process
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

  // Auth state listener to update current user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Update current user state when auth state changes
      setLoading(false); // Set loading state to false
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

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
        // Needs to be updated with a loading animation (in-progress)
        <div>Loading...</div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext); // Get the context value
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider"); // Error if context is not available
  }
  return context; // Return the context value
}
