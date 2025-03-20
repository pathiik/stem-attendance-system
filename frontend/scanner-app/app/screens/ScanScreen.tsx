import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ScanScreen() {
  // Retreiving the action type from the home page (either "sign-in" or "sign-out")
  const { action } = useLocalSearchParams<{ action: string }>();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [cameraFace, setCamerFace] = useState<"front" | "back">("back");
  const router = useRouter();

  // Requesting camera permission on mount
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Function to handle the scanned QR code
  const handleScannedQRCode = (event: { data: string }) => {
    if (scanned) return; // Prevents multiple scans

    setScanned(true);
    Alert.alert("QR Code Scanned", `Data: ${event.data}`);

    setTimeout(() => {
      setScanned(false);
      router.back();
    }, 1000);
  };

  return (
    <View className="flex-1">
      {/* Checking the permission and displaying content based on that */}
      {permission?.granted ? (
        <CameraView
          style={{ flex: 1 }}
          facing={cameraFace}
          onBarcodeScanned={scanned ? undefined : handleScannedQRCode}
        >
          <View className="absolute top-10 left-0 right-0 items-center">
            <Text className="text-white text-lg font-bold">
              {action === "sign-in" ? "Scan to Sign In" : "Scan to Sign Out"}
            </Text>
          </View>

          {/* Toggle Camera Button */}
          <TouchableOpacity
            className="absolute top-20 right-10"
            onPress={() =>
              setCamerFace(cameraFace === "back" ? "front" : "back")
            }
          >
            <View className="flex-1 items-center">
              <MaterialCommunityIcons
                name="camera-flip"
                size={32}
                color="#ffffff"
              />
              <Text className="text-white text-sm">
                {cameraFace === "back" ? "Front" : "Back"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            className="absolute bottom-10 left-5 bg-red-500 p-3 rounded-lg"
            onPress={() => router.back()}
          >
            <Text className="text-white font-bold">Cancel</Text>
          </TouchableOpacity>
        </CameraView>
      ) : (
        // Displaying permission request screen if permission is not granted
        <View className="flex-1 items-center justify-center bg-white">
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />
          <Text className="text-lg font-bold">Camera Permission Required</Text>
          <TouchableOpacity
            className="bg-primary px-5 py-4 rounded-lg mt-5"
            onPress={requestPermission}
          >
            <Text className="text-white font-bold">Request Permission</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
