import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import "./globals.css";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "Attendance App (Scanner)", headerShown: false }}
        />
        <Stack.Screen
          name="screens/ScanScreen"
          options={{ title: "QR Code Scanner", headerShown: false }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
