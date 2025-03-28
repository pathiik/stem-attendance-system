import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert, StatusBar } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CameraView } from "expo-camera";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

import { useCamera } from "../hooks/useCamera";
import { useQRScanner } from "../hooks/useQRScanner";
import { useManualEntry } from "../hooks/useManualEntry";
import { useStudentStatus } from "../hooks/useStudentStatus";

import CameraOverlay from "../components/ui/CameraOverlay";
import InCameraButton from "../components/buttons/InCameraButton";
import ScanAlertModal from "../components/modals/ScanAlertModal";
import StudentIDModal from "../components/modals/StudentIDModal";
import { ROUTES } from "../constants/routes";

// StudentInfo type with specific fields
type StudentInfo = {
  name: string;
  currentStatus: "Present" | "Absent";
  updatedStatus: "Present" | "Absent";
};

// ScanScreen component (screen with camera view)
export default function ScanScreen() {
  // Get action ("sign-in" or "sign-out") and cameraFace ("back" or "front") parameters from the index page
  const { action, cameraFace } = useLocalSearchParams<{
    action: string;
    cameraFace: "back" | "front";
  }>();

  const router = useRouter(); // Get router object for navigation

  // Get functions and states from useCamera hook
  const {
    permission,
    cameraFace: currentCameraFace,
    toggleCameraFace,
    requestPermission,
  } = useCamera(cameraFace);

  // Get functions and states from useQRScanner hook
  const { scanned, qrData, handleScannedQR, resetScanner } = useQRScanner();

  // Get functions and states from useManualEntry hook
  const {
    manualEntry,
    studentID,
    setStudentID,
    modalVisible,
    toggleManualEntry,
  } = useManualEntry();

  // Get functions and states from useStudentStatus hook
  const { getStudentData, updateStudentStatus } = useStudentStatus();

  // Local state for student info
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  // Reset scanner and student info on focus
  useFocusEffect(
    useCallback(() => {
      resetScanner();
      setStudentInfo(null);
    }, [cameraFace])
  );

  // Function to process student data
  const processStudent = async (id: string, name?: string) => {
    try {
      const data = await getStudentData(id);
      if (!data) {
        Alert.alert("Error", "Student not found!");
        return null;
      }

      // Check if student name matches
      if (name !== undefined && data.name !== name) {
        Alert.alert("Error", "Student name does not match!");
        return null;
      }

      // Update student status based on action
      const updatedStatus =
        action === "sign-in" && data.status === "Absent"
          ? "Present"
          : action === "sign-out" && data.status === "Present"
          ? "Absent"
          : data.status;

      return {
        name: data.name,
        currentStatus: data.status,
        updatedStatus,
      };
    } catch (error) {
      Alert.alert("Error", "Failed to process student data!");
      return null;
    }
  };

  // Function to handle scanned QR code
  const handleQRScanned = async ({ data }: { data: string }) => {
    try {
      // Parse the scanned QR data
      const parsedData = handleScannedQR(data);
      if (parsedData) {
        const info = await processStudent(
          parsedData.studentID,
          parsedData.name
        );
        setStudentInfo(info);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to scan QR data!");
    }
  };

  // Function to handle manual student ID submission
  const handleManualSubmit = async () => {
    try {
      // Process student data based on student ID
      const info = await processStudent(studentID);
      if (info) {
        setStudentInfo(info);
        toggleManualEntry();
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit student ID");
    }
  };

  // Function to confirm the student status update
  const handleConfirm = async () => {
    try {
      // Update student status in the database
      if (studentInfo) {
        await updateStudentStatus(
          qrData?.studentID || studentID,
          studentInfo.updatedStatus
        );
        router.push(ROUTES.HOME);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update student status");
    }
  };

  // Check for camera permission and request if not granted
  if (!permission?.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <StatusBar barStyle="dark-content" />
        <Text className="text-lg font-bold">Camera Permission Required</Text>
        <TouchableOpacity
          className="bg-primary px-5 py-4 rounded-lg mt-5"
          onPress={requestPermission}
        >
          <Text className="text-white font-bold">Request Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <CameraView
        style={{ flex: 1 }}
        facing={currentCameraFace}
        onBarcodeScanned={
          !manualEntry && !scanned ? handleQRScanned : undefined
        }
      >
        {/* Camera Overlay */}
        <CameraOverlay />

        {/* Action Text ("sign-in" or "sign-out") */}
        <View className="absolute top-10 left-0 right-0 items-center">
          <Text className="text-white text-lg font-bold">
            {action === "sign-in" ? "Scan to Sign In" : "Scan to Sign Out"}
          </Text>
        </View>

        {/* Camera Face Toggle Button */}
        <TouchableOpacity
          className="absolute top-20 right-10"
          onPress={toggleCameraFace}
        >
          <View className="flex-1 items-center">
            <MaterialCommunityIcons
              name="camera-flip"
              size={32}
              color="#ffffff"
            />
            <Text className="text-white text-sm">
              {currentCameraFace === "back" ? "Front" : "Back"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          className="absolute bottom-10 left-5 bg-red-500 p-3 rounded-lg"
          onPress={() => router.push(ROUTES.HOME)}
        >
          <Text className="text-white font-bold">Cancel</Text>
        </TouchableOpacity>

        {/* Use Student ID Button */}
        {!manualEntry && (
          <TouchableOpacity
            className="absolute bottom-10 right-5 items-center"
            onPress={toggleManualEntry}
          >
            <InCameraButton buttonText="Use Student ID" />
          </TouchableOpacity>
        )}
      </CameraView>

      {/* Manual Entry Modal */}
      <StudentIDModal
        visible={modalVisible}
        studentID={studentID}
        onStudentIDChange={setStudentID}
        onSubmit={handleManualSubmit}
        onToggleMode={toggleManualEntry}
      />

      {/* Scan Alert Modal */}
      {studentInfo && (
        <ScanAlertModal
          name={studentInfo.name}
          studentID={qrData?.studentID || studentID}
          currentStatus={studentInfo.currentStatus}
          updatedStatus={studentInfo.updatedStatus}
          action={action}
          onConfirm={handleConfirm}
          onClose={() => setStudentInfo(null)}
        />
      )}
    </View>
  );
}
