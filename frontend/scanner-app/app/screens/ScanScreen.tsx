import React, { useState, useEffect, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";

import CameraOverlay from "../components/CameraOverlay";
import InCameraButton from "../components/InCameraButton";
import ScanAlertModal from "../components/ScanAlertModal";

// ScanScreen component (screen with camera view)
export default function ScanScreen() {
  // Get the action from the index page (either "sign-in" or "sign-out")
  const { action } = useLocalSearchParams<{ action: string }>();

  const [permission, requestPermission] = useCameraPermissions(); // State for camera permission
  const [scanned, setScanned] = useState(false); // State for whether a QR code has been scanned
  const [cameraFace, setCameraFace] = useState<"front" | "back">("back"); // State for camera facing direction
  const [useStudentID, setUseStudentID] = useState(false); // State for whether to use student ID instead of QR code
  const [modalVisible, setModalVisible] = useState(false); // State for whether the student ID modal is visible
  const [alertModalVisible, setAlertModalVisible] = useState(false); // State for whether the alert modal is visible

  const router = useRouter();
  const [name, setName] = useState(""); // Student Name
  const [studentID, setStudentID] = useState(""); // Student ID
  const [currentStatus, setCurrentStatus] = useState(""); // Current status of the student
  const [updatedStatus, setUpdatedStatus] = useState(""); // Updated status of the student (after sign-in/sign-out)

  // Request camera permission if not granted
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Reset states when the screen loses focus (navigated away from)
  useFocusEffect(
    useCallback(() => {
      return () => {
        setScanned(false);
        setAlertModalVisible(false);
        setModalVisible(false);
        setName("");
        setStudentID("");
        setCurrentStatus("");
        setUpdatedStatus("");
      };
    }, [])
  );

  // Function to handle scanned QR code
  const handleScannedQRCode = async (event: { data: string; type: string }) => {
    // If already scanned or using student ID, do not scan again
    if (scanned || useStudentID) return;

    try {
      const lines = event.data.split("\n");
      const qrData: { [key: string]: string } = {};

      // Parse the QR code data (into key-value pairs)
      lines.forEach((line) => {
        const [key, value] = line.split(":").map((part) => part.trim());
        if (key && value) {
          qrData[key] = value;
        }
      });

      // Check if the required fields are present in the QR code data
      const requiredFields = ["Student ID", "Name", "Status"];
      const isValidQRCode = requiredFields.every((field) => qrData[field]);

      if (!isValidQRCode) return;

      const studentID = qrData["Student ID"];
      const name = qrData["Name"];

      // Fetch student data from Firestore
      const studentRef = doc(db, "students", studentID);
      const studentSnap = await getDoc(studentRef);

      // If student not found, show an error alert
      if (!studentSnap.exists()) {
        Alert.alert("Error", "Student not found");
        return;
      }

      // Store the student data
      const studentData = studentSnap.data();

      // Validate student name
      if (studentData.name !== name) {
        Alert.alert("Error", "Student name does not match");
        return;
      }

      const currentStatus = studentData.status;

      // Determine updated status based on the action (sign-in/sign-out)
      let updatedStatus = currentStatus;
      if (action === "sign-in" && currentStatus === "Absent") {
        updatedStatus = "Present";
      } else if (action === "sign-out" && currentStatus === "Present") {
        updatedStatus = "Absent";
      }

      // Update state variables with student data
      setName(name);
      setStudentID(studentID);
      setCurrentStatus(currentStatus);
      setUpdatedStatus(updatedStatus);

      setScanned(true);
      setAlertModalVisible(true);
    } catch (error) {
      console.error("Error parsing QR code data:", error);
      Alert.alert("Error", "Invalid QR code data");
    }
  };

  // Function to handle using student ID instead of QR code
  const handleUseStudentID = () => {
    setUseStudentID((prev) => !prev);
    setModalVisible((prev) => !prev);
  };

  // Function to handle manual submission of student ID
  const handleSubmitStudentID = async () => {
    if (!studentID.trim()) {
      Alert.alert("Error", "Student ID cannot be empty");
      return;
    }

    // Fetch student data from Firestore
    const studentRef = doc(db, "students", studentID);
    const studentSnap = await getDoc(studentRef);

    // If student not found, show an error
    if (!studentSnap.exists()) {
      Alert.alert("Error", "Student not found");
      return;
    }

    // Store the student data
    const studentData = studentSnap.data();
    const { name, status: currentStatus } = studentData; // Destructure student data

    // Determine updated status based on the action (sign-in/sign-out)
    let updatedStatus = currentStatus;
    if (action === "sign-in" && currentStatus === "Absent") {
      updatedStatus = "Present";
    } else if (action === "sign-out" && currentStatus === "Present") {
      updatedStatus = "Absent";
    }

    // Update state variables with student data
    setName(name);
    setStudentID(studentID);
    setCurrentStatus(currentStatus);
    setUpdatedStatus(updatedStatus);

    setModalVisible(false);
    setAlertModalVisible(true);
  };

  // Function to confirm the sign-in/sign-out action
  const handleConfirm = async () => {
    // Link to the student document in Firestore
    const studentRef = doc(db, "students", studentID);
    // Update the status of the student in Firestore
    await updateDoc(studentRef, { status: updatedStatus });

    setScanned(false);
    setAlertModalVisible(false);
    router.push("/");
  };

  return (
    <View className="flex-1">
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
              currentStatus={currentStatus}
              updatedStatus={updatedStatus}
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

          {/* Toggle camera facing direction */}
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

          {/* Cancel button (nativate to home screen) */}
          <TouchableOpacity
            className="absolute bottom-10 left-5 bg-red-500 p-3 rounded-lg"
            onPress={() => router.push("/")}
          >
            <Text className="text-white font-bold">Cancel</Text>
          </TouchableOpacity>

          {/* Toggle to manual ID input */}
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
        // UI if camera permission is not granted
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

      {/* Manual Student ID input modal */}
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
        >
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
              style={styles.input}
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

      {/* Alert modal for status update */}
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

// Styles using StyleSheet (for better targeting and performance)
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
