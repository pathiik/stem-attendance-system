import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../FirebaseConfig";
import { router } from "expo-router";
import AuthTabs from "../components/AuthTabs";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../FirebaseConfig";

// Authentication screen for parents
export default function AuthScreen() {
  // State for current active tab (login or signup)
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password input (signup only)

  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for showing/hiding confirm password (signup only)

  const [error, setError] = useState(""); // State for error message

  // Safe area insets for device compatibility
  const insets = useSafeAreaInsets();

  // Clears the error message automatically after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Function to handle password reset flow
  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Password Reset Email Sent",
        "Please check your email to reset your password."
      );
    } catch (error) {
      Alert.alert("Error", "Failed to send password reset email");
    }
  };

  // Function to handle login and signup authentication
  const handleAuth = async () => {
    // Validate password match for signup
    if (activeTab === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (activeTab === "login") {
        // Login logic (for existing users)
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/"); // Navigate to home screen
      } else {
        // Signup logic (for new users)
        const parentsRef = collection(db, "parents");
        const q = query(parentsRef, where("parent_email", "==", email));
        const querySnapshot = await getDocs(q);

        // Verify email exists in parents collection
        if (querySnapshot.empty) {
          setError("Email is not registered as a parent.");
          return;
        }

        // Creating new account (if email exists in parents collection)
        await createUserWithEmailAndPassword(auth, email, password);
        router.replace("/"); // Navigate to home screen
      }
    } catch (err) {
      // Set appropriate error message
      setError(
        activeTab === "login"
          ? "Invalid email or password"
          : "Failed to create account"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 15 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Main container with safe area padding */}
        <View
          className="flex-1 justify-start bg-white p-4"
          style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
          {/* Styling the status bar */}
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />

          {/* STEM Logo Container */}
          <View className="items-center pt-24 mb-20 bg-white">
            <Image
              source={require("../../assets/stem-logo-dark.png")}
              className="h-20"
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-primary">
              Attendance App
            </Text>
            <Text className="text-sm text-gray-500">For Parents</Text>
          </View>

          {/* Authentication Tabs (Login/Signup) */}
          <AuthTabs onTabChange={(tab) => setActiveTab(tab)} />

          {/* Error Message (if any error occurs) */}
          {error && (
            <Text className="text-red-500 mb-4 text-center">{error}</Text>
          )}

          {/* Form Input */}
          <View className="w-full mb-4">
            {/* Email Input Field */}
            <View className="w-full bg-gray-100 p-3 rounded-lg mb-4">
              <TextInput
                className="text-base text-text"
                placeholder="Email"
                placeholderTextColor="#4c516d"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input with visibility toggle */}
            <View className="w-full bg-gray-100 p-3 rounded-lg mb-2 flex-row items-center">
              <TextInput
                className="flex-1 text-base text-text"
                placeholder="Password"
                placeholderTextColor="#4c516d"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name={showPassword ? "visibility-off" : "visibility"}
                  size={24}
                  color="#4c516d"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password link (visible only in login tab) */}
            {activeTab === "login" && (
              <TouchableOpacity
                onPress={handleForgotPassword}
                className="self-end mb-3"
              >
                <Text className="text-primary text-sm font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            )}

            {/* Confirm Password Field (for signup only) */}
            {activeTab === "signup" && (
              <View className="w-full bg-gray-100 p-3 rounded-lg mb-4 flex-row items-center">
                <TextInput
                  className="flex-1 text-base text-text"
                  placeholder="Confirm Password"
                  placeholderTextColor="#4c516d"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <MaterialIcons
                    name={showConfirmPassword ? "visibility-off" : "visibility"}
                    size={24}
                    color="#4c516d"
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Login/Signup Button */}
          <TouchableOpacity
            className="w-full bg-primary p-4 rounded-lg items-center"
            onPress={handleAuth}
          >
            <Text className="text-white text-lg font-semibold">
              {activeTab === "login" ? "Login" : "Signup"}
            </Text>
          </TouchableOpacity>

          {/* Note for parents (visible only in signup tab) */}
          {activeTab === "signup" && (
            <View className="flex-row bg-blue-50 rounded-lg p-3 mt-4 items-center gap-2">
              <MaterialIcons
                name="info"
                size={20}
                color="#3b82f6"
                style={{ opacity: 0.6 }}
              />
              <Text className="text-sm text-gray-500" style={{ opacity: 0.6 }}>
                Please use the same email address you used to register your
                child.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
