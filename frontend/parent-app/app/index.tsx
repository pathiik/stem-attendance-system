import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {

  return (
    <View className="mt-5 flex justify-center items-center">
      <Text className="text-4xl">HELLO WORLD!</Text>
      <Link href={{ pathname: "./screens/AuthScreen" }}>Login</Link>
    </View>
  );
}