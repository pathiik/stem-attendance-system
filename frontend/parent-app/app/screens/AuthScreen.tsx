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

export default function AuthScreen() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const insets = useSafeAreaInsets();

  // Clearing the error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Function to handle forgot password
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

  // Function to handle login and signup
  const handleAuth = async () => {
    if (activeTab === "signup" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (activeTab === "login") {
        // Login logic
        await signInWithEmailAndPassword(auth, email, password);
        router.push("/"); // Navigating to the home screen after login
      } else {
        // Signup logic
        // Checking if the email exists in the "parents" collection
        const parentsRef = collection(db, "parents");
        const q = query(parentsRef, where("parent_email", "==", email));
        const querySnapshot = await getDocs(q);

        // If email does not exist in Firestore
        if (querySnapshot.empty) {
          setError("Email is not registered as a parent.");
          return;
        }

        // If email exists in Firestore, creating an account
        await createUserWithEmailAndPassword(auth, email, password);
        router.replace("/"); // Navigating to the home screen after signup
      }
    } catch (err) {
      setError(
        activeTab === "login"
          ? "Invalid email or password"
          : "Failed to create account"
      );
      // console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
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

          <AuthTabs onTabChange={(tab) => setActiveTab(tab)} />

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

            {/* Password Input */}
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

            {/* Forgot Password Button (visible only in login tab) */}
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
