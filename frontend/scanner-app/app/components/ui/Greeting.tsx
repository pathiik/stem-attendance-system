import { View, Text } from "react-native";

// Props for Greeting
interface GreetingProps {
  greetingText: string;
  timedGreeting: string;
  teacherName?: string;
}

// Greeting Component
export default function Greeting({
  greetingText,
  timedGreeting,
  teacherName,
}: GreetingProps) {
  return (
    // Greeting Section
    <View className="px-5 mt-6">
      <Text className="text-4xl font-bold text-white tracking-wider px-1">
        {greetingText}, {teacherName || "Teacher"}
      </Text>
      <Text className="text-lg text-white mt-3 px-1">{timedGreeting}</Text>
    </View>
  );
}
