import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import "./globals.css";

// Root layout for the app
export default function RootLayout() {
  return (
    // SafeAreaProvider is used to handle the safe area insets for the app
    <SafeAreaProvider>
      <Stack>
        {/* Home Screen (index) with no header */}
        <Stack.Screen
          name="index"
          options={{ title: "Attendance App (Scanner)", headerShown: false }}
        />
        {/* Scan Screen (camera view) with no header */}
        <Stack.Screen
          name="screens/ScanScreen"
          options={{ title: "QR Code Scanner", headerShown: false }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
