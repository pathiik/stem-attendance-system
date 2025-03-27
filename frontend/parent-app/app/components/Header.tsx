import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";

import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

// Props for the Header component
interface HeaderProps {
  title?: string;
  parentName: string | null;
  greetingText: string;
  timedGreeting: string;
  onLogout: () => void;
  showLogo?: boolean;
  showMenu: boolean;
  setShowMenu: (show: boolean) => void;
}

// Header component for the app
export default function Header({
  title = "STEM Attendance (Parent)",
  parentName,
  greetingText,
  timedGreeting,
  onLogout,
  showLogo = true,
  showMenu,
  setShowMenu,
}: HeaderProps) {
  const handleMenuPress = () => {
    setShowMenu(!showMenu);
  };

  const handleLogoutPress = () => {
    setShowMenu(false);
    onLogout();
  };

  return (
    <View>
      {/* Gradient Background */}
      {/* Using 'style' instead of 'className' as it was causing some issues with gradient in ios devices */}
      <View style={{ height: 200, position: "relative" }}>
        <LinearGradient
          colors={["#1d2951", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 200,
            zIndex: 0,
          }}
        />

        {/* Header section (with logo & three-dot menu) */}
        <View
          style={{
            position: "absolute",
            top: 50,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          {/* App Logo & Text */}
          <View className="flex-row justify-between items-center px-5">
            {showLogo && (
              <View className="flex-row items-center gap-3">
                <Image
                  source={require("../../assets/stem-icon-light.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
                <Text className="text-xl font-bold text-white">{title}</Text>
              </View>
            )}

            {/* Three-dot menu icon */}
            <TouchableOpacity onPress={handleMenuPress}>
              <MaterialIcons name="more-vert" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Logout Option */}
          {showMenu && (
            <View className="absolute right-9 top-10 bg-white shadow-2xl rounded-lg px-6 py-4 z-20">
              <TouchableOpacity
                onPress={handleLogoutPress}
                className="flex-row items-center gap-2"
              >
                <MaterialIcons name="logout" size={20} color="#ef4444" />
                <Text className="text-red-500 ml-2 font-bold">Logout</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Greeting Section */}
          <View className="px-5 mt-6">
            <Text className="text-4xl font-bold text-white tracking-wider px-1">
              {greetingText}, {parentName || "Parent"}!
            </Text>
            <Text className="text-lg text-white mt-3 px-1">
              {timedGreeting}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
