import React, { useState, useEffect, act } from "react";
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
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../FirebaseConfig";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const router = useRouter();
  const [name, setName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");

  // Requesting camera permission on mount
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Function to handle the scanned QR code
  const handleScannedQRCode = async (event: { data: string; type: string }) => {
    if (scanned || useStudentID) return; // Prevents multiple scans and disables scanning if using Student ID

    try {
      const lines = event.data.split("\n");
      const qrData: { [key: string]: string } = {};

      lines.forEach((line) => {
        const [key, value] = line.split(":").map((part) => part.trim());
        if (key && value) {
          qrData[key] = value;
        }
      });

      const requiredFields = ["Student ID", "Name", "Status"];
      const isValidQRCode = requiredFields.every((field) => qrData[field]);

      if (!isValidQRCode) return;

      const studentID = qrData["Student ID"];
      const name = qrData["Name"];

      const studentRef = doc(db, "students", studentID);
      const studentSnap = await getDoc(studentRef);

      if (!studentSnap.exists()) {
        Alert.alert("Error", "Student not found");
        return;
      }

      const studentData = studentSnap.data();

      if (studentData.name !== name) {
        Alert.alert("Error", "Student name does not match");
        return;
      }

      const currentStatus = studentData.status;

      // Determine the new status based on the action and current status
      let updatedStatus = currentStatus;
      if (action === "sign-in" && currentStatus === "Absent") {
        updatedStatus = "Present";
      } else if (action === "sign-out" && currentStatus === "Present") {
        updatedStatus = "Absent";
      }

      // Update the state with the new status
      setName(name);
      setStudentID(studentID);
      setCurrentStatus(currentStatus); // Set the state to the NEW status
      setUpdatedStatus(updatedStatus); // Set the state to the NEW status

      setScanned(true);
      setAlertModalVisible(true); // Show the modal AFTER updating the status
    } catch (error) {
      console.error("Error parsing QR code data:", error);
      Alert.alert("Error", "Invalid QR code data");
    }
  };

  const handleUseStudentID = () => {
    setUseStudentID((prev) => !prev);
    setModalVisible((prev) => !prev);
  };

  const handleSubmitStudentID = async () => {
    if (!studentID.trim()) {
      Alert.alert("Error", "Student ID cannot be empty");
      return;
    }

    const studentRef = doc(db, "students", studentID);
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      Alert.alert("Error", "Student not found");
      return;
    }

    const studentData = studentSnap.data();
    const { name, status: currentStatus } = studentData; // Current status from the database

    // Determine the new status based on the action and current status
    let updatedStatus = currentStatus;
    if (action === "sign-in" && currentStatus === "Absent") {
      updatedStatus = "Present";
    } else if (action === "sign-out" && currentStatus === "Present") {
      updatedStatus = "Absent";
    }

    // Update the state with the new status
    setName(name);
    setStudentID(studentID);
    setCurrentStatus(currentStatus);
    setUpdatedStatus(updatedStatus); // Set the state to the NEW status

    setModalVisible(false);
    setAlertModalVisible(true); // Show the modal AFTER updating the status
  };

  const handleConfirm = async () => {
    const studentRef = doc(db, "students", studentID);
    await updateDoc(studentRef, { status: updatedStatus });

    setScanned(false);
    setAlertModalVisible(false);
    router.push("/");
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
          {scanned && (
            <ScanAlertModal
              name={name}
              studentID={studentID}
              currentStatus={currentStatus} // Pass currentStatus
              updatedStatus={updatedStatus} // Pass updatedStatus (status state)
              action={action}
              onConfirm={handleConfirm}
              onClose={() => setAlertModalVisible(false)}
            />
          )}
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
            onPress={() => router.push("/")}
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
      {alertModalVisible && (
        <ScanAlertModal
          name={name}
          studentID={studentID}
          currentStatus={currentStatus}
          updatedStatus={updatedStatus}
          action={action}
          onConfirm={handleConfirm}
          onClose={() => setAlertModalVisible(false)}
        />
      )}
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
