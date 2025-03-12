import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import './globals.css';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Auth' }} />
      </Stack>
    </SafeAreaProvider>
  );
}