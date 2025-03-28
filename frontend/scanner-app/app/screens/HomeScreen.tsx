import {
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "../components/ui/Header";
import FunctionButton from "../components/buttons/FunctionButton";

// Main component
export default function Index() {
  // Loading state variable (is page still loading or not) -> currently unused
  const [loading, setLoading] = useState(false);

  const [cameraFace, setCameraFace] = useState<"front" | "back">("back"); // State for camera facing direction
  const [showMenu, setShowMenu] = useState(false); // State for showing or hiding the menu

  // Load camera face setting from local storage (as previously saved)
  useEffect(() => {
    const loadCameraFace = async () => {
      const savedCameraFace = await AsyncStorage.getItem("cameraFace");
      if (savedCameraFace) {
        setCameraFace(savedCameraFace as "front" | "back");
      }
    };
    loadCameraFace();
  }, []);

  // Function to handle camera face change (front/back) and save it to local storage
  const handleCameraFace = async () => {
    const newCameraFace = cameraFace === "back" ? "front" : "back";
    setCameraFace(newCameraFace);
    await AsyncStorage.setItem("cameraFace", newCameraFace);
  };

  const handleScreenPress = () => {
    setShowMenu(false);
  };

  // Loading screen (if data is not yet fetched -> currenly unused)
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#1d2951" />
      </View>
    );
  }

  return (
    <Pressable
      className="flex-1 bg-white"
      onPress={handleScreenPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}
    >
      {/* Styling the status bar */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Header
        cameraFace={cameraFace}
        onCameraFaceChange={handleCameraFace}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        onLogout={() => {}}
      />

      {/* Function Buttons */}
      <View
        className="flex-row justify-center items-center mt-10"
        style={{ gap: 50 }}
      >
        {/* Sign In Button */}
        <FunctionButton
          text="Sign In"
          icon="login"
          color="green"
          action="sign-in"
          cameraFace={cameraFace}
        />

        {/* Sign Out Button */}
        <FunctionButton
          text="Sign Out"
          icon="logout"
          color="red"
          action="sign-out"
          cameraFace={cameraFace}
        />
      </View>
    </Pressable>
  );
}
