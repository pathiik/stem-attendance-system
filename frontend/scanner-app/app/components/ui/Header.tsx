import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

import MenuModal from "../modals/MenuModal";
import Greeting from "./Greeting";
import { useGreeting } from "../../hooks/useGreeting";

// Props for the Header component
interface HeaderProps {
  title?: string;
  teacherName?: string;
  cameraFace: "front" | "back";
  onCameraFaceChange: () => void;
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
  onLogout?: () => void;
}

// Header component for the app
export default function Header({
  title = "STEM Scanner",
  teacherName,
  cameraFace,
  onCameraFaceChange,
  showMenu,
  setShowMenu,
  onLogout = () => {},
}: HeaderProps) {
  const { greetingText, timedGreeting } = useGreeting(); // Hook for getting the greeting text

  // Function to handle the menu press
  const handleMenuPress = () => {
    setShowMenu(!showMenu);
  };

  // Function to handle the menu close
  const handleCloseMenu = () => {
    setShowMenu(false);
  };

  return (
    <View>
      {/* Gradient Background */}
      {/* Using 'StyleSheet' as TailwindCSS was causing some issues with gradient in ios devices */}
      <View style={{ height: 200, position: "relative" }}>
        <LinearGradient
          colors={["#1D2951", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />

        {/* Header Content */}
        <View style={styles.headerContent}>
          <View className="flex-row items-center justify-between px-5">
            {/* Logo & Title */}
            <View className="flex-row items-center gap-3">
              <Image
                source={require("../../../assets/stem-icon-light.png")}
                className="w-12 h-12"
                resizeMode="contain"
              />
              <Text className="text-xl font-bold text-white">{title}</Text>
            </View>

            {/* Three-dot menu icon */}
            <TouchableOpacity onPress={handleMenuPress}>
              <MaterialIcons name="more-vert" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <Greeting
            greetingText={greetingText}
            timedGreeting={timedGreeting}
            teacherName={teacherName}
          />

          {/* Menu Modal */}
          <MenuModal
            visible={showMenu}
            cameraFace={cameraFace}
            onCameraFaceChange={onCameraFaceChange}
            onLogout={onLogout}
            onClose={handleCloseMenu}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 200,
    zIndex: 0,
  },
  headerContent: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 50,
    zIndex: 10,
  },
});
