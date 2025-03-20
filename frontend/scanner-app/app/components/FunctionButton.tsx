import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

interface FunctionButtonProps {
  text: string;
  icon: keyof typeof AntDesign.glyphMap;
  color: string;
  action: string;
}

export default function FunctionButton({
  text,
  icon,
  color,
  action,
}: FunctionButtonProps) {
  return (
    <TouchableOpacity
      className="p-4 bg-white rounded-lg shadow-lg items-center border border-gray-100"
      onPress={() => {
        router.push({
          pathname: "../screens/ScanScreen",
          params: { action },
        });
      }}
    >
      <View className="items-center">
        <AntDesign name={icon} size={42} color={color} />
        <Text
          className="text-lg font-bold"
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
