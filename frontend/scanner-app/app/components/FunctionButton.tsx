import { View, Text, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

interface FuncButtonProps {
  text: string;
  icon: keyof typeof AntDesign.glyphMap;
  color: string;
}

export default function FunctionButton({ text, icon, color }: FuncButtonProps) {
  return (
    <TouchableOpacity className="p-4 bg-white rounded-lg shadow-lg items-center border border-gray-100">
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
