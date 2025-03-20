import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StatusBar,
  Modal,
  TextInput,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CameraOverlay from "../components/CameraOverlay";
import InCameraButton from "../components/InCameraButton";
import ScanAlertModal from "../components/ScanAlertModal";

export default function ScanScreen() {
  // Retreiving the action type from the home page (either "sign-in" or "sign-out")
  const { action } = useLocalSearchParams<{ action: string }>();

  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [cameraFace, setCameraFace] = useState<"front" | "back">("back");
  const [useStudentID, setUseStudentID] = useState(false);
  const [studentID, setStudentID] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const router = useRouter();

  // Requesting camera permission on mount
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Function to handle the scanned QR code
  const handleScannedQRCode = (event: { data: string; type: string }) => {
    if (scanned || useStudentID) return; // Prevents multiple scans and disables scanning if using Student ID

    setScanned(true);
    setAlertModalVisible(true);

    setTimeout(() => {
      setScanned(false);
      setAlertModalVisible(false);
      router.back();
    }, 2000);
  };

  const handleUseStudentID = () => {
    setUseStudentID((prev) => !prev);
    setModalVisible((prev) => !prev);
  };

  const handleSubmitStudentID = () => {
    if (!studentID.trim()) {
      Alert.alert("Error", "Student ID cannot be empty");
      return;
    }
    setModalVisible(false);
    setAlertModalVisible(true);

    setTimeout(() => {
      setAlertModalVisible(false);
      router.back();
    }, 2000);
  };

  return (
    <View className="flex-1">
      {/* Checking the permission and displaying content based on that */}
      {permission?.granted ? (
        <CameraView
          style={{ flex: 1 }}
          facing={cameraFace}
          onBarcodeScanned={
            !useStudentID && !scanned ? handleScannedQRCode : undefined
          }
        >
          <CameraOverlay />
          {scanned && <ScanAlertModal />}
          <View className="absolute top-10 left-0 right-0 items-center">
            <Text className="text-white text-lg font-bold">
              {action === "sign-in" ? "Scan to Sign In" : "Scan to Sign Out"}
            </Text>
          </View>

          {/* Toggle Camera Button */}
          <TouchableOpacity
            className="absolute top-20 right-10"
            onPress={() =>
              setCameraFace(cameraFace === "back" ? "front" : "back")
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

          {/* Alternative attendance update (using Student ID) */}
          {/* Use Student ID Button */}
          {!useStudentID && (
            <TouchableOpacity
              className="absolute bottom-10 right-5 items-center"
              onPress={handleUseStudentID}
            >
              <InCameraButton buttonText="Use Student ID" />
            </TouchableOpacity>
          )}
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

      {/* Student ID Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
          {/* Button to switch to QR Scanning */}
          <TouchableOpacity
            className="bg-gray-300 absolute top-20 p-1 rounded-xl"
            onPress={handleUseStudentID}
          >
            <InCameraButton buttonText="Scan QR Code" />
          </TouchableOpacity>

          <View className="bg-white p-6 rounded-lg" style={{ width: 300 }}>
            <Text className="text-lg font-bold text-primary text-center mb-3">
              Enter Student ID
            </Text>
            <TextInput
              style={styles.input} // Using styles instead of className (Tailwind CSS doesn't work as intended)
              placeholder="Student ID"
              value={studentID}
              onChangeText={setStudentID}
              keyboardType="numeric"
            />
            <View className="flex-row space-between">
              <TouchableOpacity
                className="bg-primary"
                style={styles.modalButton}
                onPress={handleSubmitStudentID}
              >
                <Text className="text-white font-bold text-center">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Alert Modal */}
      {alertModalVisible && <ScanAlertModal />}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 16,
  },
  modalButton: {
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
});
