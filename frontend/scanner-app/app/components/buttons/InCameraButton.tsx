import { Text, View } from "react-native";
import React from "react";

// InCameraButton component prop with specific type
interface InCameraButtonProps {
  buttonText: string;
}

// InCameraButton component for the buttons in the camera view
export default function InCameraButton({ buttonText }: InCameraButtonProps) {
  return (
    <View className="bg-primary p-3 rounded-lg">
      <Text className="text-white font-bold">{buttonText}</Text>
    </View>
  );
}
