import { Text, View } from "react-native";
import React from "react";

interface InCameraButtonProps {
  buttonText: string;
}

export default function InCameraButton({ buttonText }: InCameraButtonProps) {
  return (
    <View className="bg-primary p-3 rounded-lg">
      <Text className="text-white font-bold">{buttonText}</Text>
    </View>
  );
}
