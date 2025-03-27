import { View, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

// Props for the FormInput component
interface FormInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  showPassword?: boolean;
  iconName?: keyof typeof MaterialIcons.glyphMap;
  keyboardType?: "default" | "email-address";
}

// Form Input component
export default function FormInput({
  placeholder,
  value,
  onChangeText,
  showPassword = false,
  iconName,
  keyboardType = "default",
}: FormInputProps) {
  const [showText, setShowText] = useState(!showPassword); // Show password text

  return (
    <View className="w-full bg-gray-100 p-3 rounded-lg mb-4 flex-row items-center">
      {iconName && (
        <MaterialIcons
          name={iconName}
          size={20}
          color="#4c516d"
          style={{ marginRight: 8 }}
        />
      )}
      <TextInput
        className="flex-1 text-base text-text"
        placeholder={placeholder}
        placeholderTextColor="#4c516d"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={showPassword && !showText}
        keyboardType={keyboardType}
      />
      {showPassword && (
        <TouchableOpacity onPress={() => setShowText(!showText)}>
          <MaterialIcons
            name={showText ? "visibility-off" : "visibility"}
            size={20}
            color="#4c516d"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
