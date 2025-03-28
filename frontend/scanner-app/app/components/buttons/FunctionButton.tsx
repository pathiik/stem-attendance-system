import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { ROUTES } from "@/app/constants/routes";

// FunctionButton component props with specific types
interface FunctionButtonProps {
  text: string;
  icon: keyof typeof AntDesign.glyphMap; // Icon name from AntDesign
  color: string;
  action: string;
  cameraFace: "back" | "front";
}

// FunctionButton component for the function buttons on the home screen
export default function FunctionButton({
  text,
  icon,
  color,
  action,
  cameraFace,
}: FunctionButtonProps) {
  return (
    <TouchableOpacity
      className="p-4 bg-white rounded-lg shadow-lg items-center border border-gray-100"
      onPress={() => {
        // Navigate to the ScanScreen with the specific action ("sign-in" or "sign-out") and cameraFace ("back" or "front")
        router.push({
          pathname: ROUTES.SCAN_SCREEN,
          params: { action, cameraFace },
        });
      }}
    >
      <View className="items-center">
        <AntDesign name={icon} size={42} color={color} />
        <Text
          className="text-lg font-bold"
          // Using 'style' for appropiate styling
          style={{
            color: color,
            width: 80,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
