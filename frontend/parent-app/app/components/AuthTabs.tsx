import { View, Text, TouchableOpacity } from "react-native";

// Authentication Tab type
type AuthTab = "login" | "signup";

// Props for the AuthTabs component
interface AuthTabsProps {
  activeTab: AuthTab;
  onTabChange: (tab: AuthTab) => void;
}

// Authentication Tabs component
export default function AuthTabs({ activeTab, onTabChange }: AuthTabsProps) {
  return (
    <View className="flex-row justify-center mb-8">
      {/* Login Tab */}
      <TouchableOpacity
        className={`px-8 py-3 rounded-full ${
          activeTab === "login" ? "bg-primary" : "bg-gray-200"
        }`}
        onPress={() => onTabChange("login")}
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
        onPress={() => onTabChange("signup")}
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
