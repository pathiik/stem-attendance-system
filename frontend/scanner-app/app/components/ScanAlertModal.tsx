import { View, Text, Modal, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

// ScanAlertModal component props with specific types
interface ScanAlertModalProps {
  name: string;
  studentID: string;
  currentStatus: string;
  updatedStatus: string;
  action: string;
  // Functions to confirm the update (void -> no return value)
  onConfirm: () => void;
  onClose: () => void;
}

// ScanAlertModal component for the alert modal when a student signs in/out
export default function ScanAlertModal({
  name,
  studentID,
  currentStatus,
  updatedStatus,
  action,
  onConfirm,
  onClose,
}: ScanAlertModalProps) {
  const [showFirstModal, setShowFirstModal] = useState(true); // Show first modal by default
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Visibility of success modal
  const isStatusUpdated = updatedStatus !== currentStatus; // Check if status is updated

  // Auto-close the success modal after 5 seconds
  useEffect(() => {
    if (showSuccessModal) {
      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, onClose]);

  // Handle the confirmation logic
  const handleConfirm = () => {
    setShowFirstModal(false);
    onConfirm();

    if (isStatusUpdated) {
      setShowSuccessModal(true); // Show success modal if status is updated
    } else {
      onClose(); // Close the modal if status is unchanged
    }
  };

  return (
    <>
      {/* First Modal -> Displays status update/unchnaged info */}
      {showFirstModal && (
        <Modal transparent={true} visible={true} animationType="fade">
          <View className="flex-1 justify-center items-center">
            <View
              className="flex items-center justify-center bg-white p-6 rounded-lg"
              style={{ width: 300 }}
            >
              <Text className="text-primary font-bold text-xl mb-3">
                {isStatusUpdated ? "Status Updated" : "Status Unchanged"}
              </Text>
              <View className="flex-row items-center justify-between gap-3 mb-3">
                <AntDesign
                  name={action === "sign-in" ? "login" : "logout"}
                  size={35}
                  color={action === "sign-in" ? "green" : "red"}
                />
                <View>
                  <Text
                    className="text-lg font-semibold text-primary uppercase"
                    style={{ maxWidth: 200 }}
                    numberOfLines={2}
                  >
                    {name}
                  </Text>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons
                      name="badge"
                      size={16}
                      style={{ color: "gray" }}
                    />
                    <Text className="text-sm" style={{ color: "gray " }}>
                      ID: {studentID}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex-row items-center justify-between gap-2">
                <Text className="text-sm font-medium text-gray-500">
                  {isStatusUpdated ? "Status updated to" : "Current status is"}
                </Text>
                <View
                  className={`px-3 py-1 rounded-full ${
                    updatedStatus === "Present" ? "bg-green-100" : "bg-red-100"
                  }`}
                  style={{ width: 65 }}
                >
                  <Text
                    className={`text-sm font-semibold text-center ${
                      updatedStatus === "Present"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {updatedStatus}
                  </Text>
                </View>
              </View>

              {/* 'Confirm Update' or 'Close' button depending on the state of status */}
              <TouchableOpacity
                className="bg-primary px-6 py-3 rounded-lg mt-6 w-full items-center"
                onPress={handleConfirm}
              >
                <Text className="text-white font-bold">
                  {isStatusUpdated ? "Confirm Update" : "Close"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Success Modal -> Displays success message after status update */}
      {showSuccessModal && (
        <Modal transparent={true} visible={true} animationType="fade">
          <View className="flex-1 justify-center items-center bg-black/50">
            <View
              className="bg-white p-6 rounded-lg items-center"
              style={{ width: 300 }}
            >
              <AntDesign
                name="checkcircle"
                size={50}
                color={action === "sign-in" ? "green" : "red"}
              />
              <Text
                className={`text-xl font-bold mt-4 ${
                  action === "sign-in" ? "text-green-700" : "text-red-700"
                }`}
              >
                {action === "sign-in" ? "Signed In" : "Signed Out"}
              </Text>
              <Text className="text-sm text-gray-500 mt-2">
                Status updated successfully
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
