import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import "./globals.css";

// Root layout for the app
export default function RootLayout() {
  return (
    // SafeAreaProvider is used to handle the safe area insets for the app
    <SafeAreaProvider>
      <Stack>
        {/* Authentication Screen (Login/Signup) with no header */}
        <Stack.Screen
          name="screens/AuthScreen"
          options={{ title: "Attendance App (Parents)", headerShown: false }}
        />
        {/* Home Screen (index) with no header */}
        <Stack.Screen
          name="index"
          options={{ title: "Attendance App (Parents)", headerShown: false }}
        />
        {/* Student Details Screen with header title "Student Details" */}
        <Stack.Screen
          name="screens/StudentDetailsScreen"
          options={{ title: "Student Details" }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
