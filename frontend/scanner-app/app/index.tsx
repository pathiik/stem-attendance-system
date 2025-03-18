import { Text, View, StatusBar } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 bg-white items-center justify-center p-5">
      {/* Styling the status bar */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Text className="text-2xl text-primary font-bold">STEM Canada</Text>
      <Text className="text-lg text-secondary font-semibold">Scanner App</Text>
    </View>
  );
}
