import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

// Authentication tabs component
export default function AuthTabs({
  onTabChange,
}: {
  onTabChange: (tab: "login" | "signup") => void;
}) {
  // State for active tab (login or signup)
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // Function to handle tab change
  const handleTabChange = (tab: "login" | "signup") => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <View className="flex-row justify-center mb-8">
      {/* Login Tab */}
      <TouchableOpacity
        className={`px-8 py-3 rounded-full ${
          activeTab === "login" ? "bg-primary" : "bg-gray-200"
        }`}
        onPress={() => handleTabChange("login")}
        activeOpacity={0.7}
      >
        <Text
          className={`text-lg font-semibold ${
            activeTab === "login" ? "text-white" : "text-text"
          }`}
        >
          Login
        </Text>
      </TouchableOpacity>

      {/* Signup Tab */}
      <TouchableOpacity
        className={`px-8 py-3 rounded-full ml-4 ${
          activeTab === "signup" ? "bg-primary" : "bg-gray-200"
        }`}
        onPress={() => handleTabChange("signup")}
        activeOpacity={0.7}
      >
        <Text
          className={`text-lg font-semibold ${
            activeTab === "signup" ? "text-white" : "text-text"
          }`}
        >
          Signup
        </Text>
      </TouchableOpacity>
    </View>
  );
}
