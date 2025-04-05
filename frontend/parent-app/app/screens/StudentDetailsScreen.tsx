import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";

import { MaterialIcons, Octicons } from "@expo/vector-icons";
import Modal from "react-native-modal";

import { db } from "../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

import { formatDate, formatPhone } from "../utils/formatters";
import ContactInfoCard from "../components/ContactInfoCard";
import ReportIssueModal from "../components/ReportIssueModal";

// Student Details Screen
export default function StudentDetailsScreen() {
  // Get student details from the index page
  const { student } = useLocalSearchParams();
  const studentDetails = JSON.parse(student as string); // Parse the student details

  const [showMore, setShowMore] = useState(false); // State for showing/hiding more details
  const [showQRCode, setShowQRCode] = useState(false); // State for showing/hiding QR Code
  const [qrCode, setQrCode] = useState(""); // State for storing QR Code URL

  const [showMenu, setShowMenu] = useState(false); // State for showing/hiding three-dot menu
  const [showReportModal, setShowReportModal] = useState(false); // State for showing/hiding report modal

  // Fetches QR Code from Firestore when Show QR Code button is pressed and showQRCode state is true
  useEffect(() => {
    if (showQRCode) {
      const fetchQRCode = async () => {
        try {
          const qrCodeRef = doc(
            db,
            "qr_codes",
            studentDetails.student_id.toString()
          );
          const qrCodeSnap = await getDoc(qrCodeRef);

          if (qrCodeSnap.exists()) {
            setQrCode(qrCodeSnap.data().qr_code_url);
          } else {
            console.log("No QR Code found");
          }
        } catch (error) {
          console.error("Error fetching QR Code: ", error);
        }
      };
      fetchQRCode();
    }
  }, [showQRCode]);

  // Function to show the report modal
  const handleOpenReportModal = () => {
    setShowMenu(false);
    setShowReportModal(true);
  };

  return (
    <View className="flex-1 bg-white">
      {/* Styling the status bar */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Info icon for rporting issue */}
      <View className="absolute top-4 right-4 z-10">
        <TouchableOpacity onPress={() => setShowMenu((prev) => !prev)}>
          <MaterialIcons name="info" size={24} color="#1d2951" />
        </TouchableOpacity>
      </View>

      {/* Profile Picture and Name Section */}
      <View className="items-center mt-5">
        {/* Placeholder for profile picture (if any) */}
        <View className="w-24 h-24 rounded-full bg-gray-200 justify-center items-center">
          <MaterialIcons name="person" size={40} color="#1d2951" />
        </View>

        {/* Student Name and Basic Info */}
        <View className="mt-2 items-center">
          <Text
            className="text-2xl text-center font-bold text-primary uppercase tracking-wide"
            numberOfLines={2}
          >
            {studentDetails.name}
          </Text>
          {/* Student Email */}
          <View className="flex-row items-center gap-1">
            <Text
              className="text-sm text-gray-600 text-center font-medium mt-1"
              numberOfLines={1}
              style={{ width: 250 }}
            >
              {studentDetails.email}
            </Text>
          </View>
          {/* Student ID */}
          <View className="flex-row items-center gap-1">
            <Text className="text-lg my-1 text-gray-600">
              Student ID: {studentDetails.student_id}
            </Text>
          </View>
          {/* Attendance Status Indicator */}
          <View
            className={`px-3 py-1 my-1 rounded-full ${
              studentDetails.status === "Present"
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                studentDetails.status === "Present"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {studentDetails.status}
            </Text>
          </View>
        </View>
      </View>

      {/* Student Details */}
      <ScrollView
        className="flex-1 px-5 py-5 mb-4 mt-3"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        {/* Student Details Card */}
        <View className="bg-white px-5 py-4 rounded-lg mb-4 shadow-2xl">
          {/* Age and Date of Birth Section */}
          <View className="flex-row justify-between mt-2">
            {/* Age */}
            <View className="flex-1 items-center gap-1">
              <MaterialIcons name="cake" size={20} color="#1d2951" />
              <Text className="text-lg text-gray-600">
                Age: {studentDetails.age}
              </Text>
            </View>

            {/* Date of Birth */}
            <View className="flex-1 items-center gap-1">
              <MaterialIcons name="calendar-today" size={20} color="#1d2951" />
              <Text className="text-lg text-gray-600">
                DOB: {formatDate(studentDetails.date_of_birth)}
              </Text>
            </View>
          </View>

          {/* Location */}
          <View className="flex-row justify-center items-center mt-4 gap-1">
            <MaterialIcons name="location-on" size={20} color="#1d2951" />
            <Text className="text-lg text-gray-600" numberOfLines={1}>
              {studentDetails.address}
            </Text>
          </View>

          {/* Parent Information Section */}
          <ContactInfoCard
            title="Parent Information"
            iconName="group"
            name={studentDetails.parent_name}
            phone={formatPhone(studentDetails.parent_phone)}
            email={studentDetails.parent_email}
          />

          {/* Show QR Code Button */}
          <TouchableOpacity onPress={() => setShowQRCode(true)}>
            <View className="flex-row items-center justify-center gap-3 mt-6 mb-2 border rounded-lg border-primary py-2">
              <MaterialIcons name="qr-code" size={24} color="#1d2951" />
              <Text className="text-lg font-bold text-primary">
                Show QR Code
              </Text>
            </View>
          </TouchableOpacity>

          {/* Accordion for "View More" */}
          <TouchableOpacity
            onPress={() => setShowMore(!showMore)}
            className="mt-4"
          >
            <View className="flex-row items-center justify-between border-t border-gray-200 mt-1 py-2">
              <Text className="text-lg font-bold text-primary">
                {showMore ? "View Less" : "View More"}
              </Text>
              <MaterialIcons
                name={showMore ? "expand-less" : "expand-more"}
                size={24}
                color="#1d2951"
              />
            </View>
          </TouchableOpacity>

          {/* Hidden Details when "View More" is clicked */}
          {showMore && (
            <View>
              <ContactInfoCard
                title="Emergency Information"
                iconName="emergency"
                name={studentDetails.emergency_contact_name}
                phone={formatPhone(studentDetails.emergency_contact_phone)}
                email={studentDetails.emergency_contact_email}
              />
              {/* ID Expiry Date Section */}
              <View className="mt-4">
                <Text className="text-lg text-gray-600">
                  ID Expiry Date: {formatDate(studentDetails.id_expiry_date)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Report Issue Option */}
      {showMenu && (
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View className="absolute right-9 top-12 bg-white shadow-2xl rounded-lg px-6 py-4 z-20">
            <TouchableOpacity
              className="flex-row items-center justify-center gap-2"
              onPress={handleOpenReportModal}
            >
              <Octicons name="report" size={18} color="#1d2951" />
              <Text className="text-primary ml-2 font-bold">Report Issue</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      )}

      {/* QR Code Modal */}
      <Modal
        isVisible={showQRCode}
        onBackdropPress={() => setShowQRCode(false)}
        className="justify-center items-center"
      >
        <View className="bg-white p-6 rounded-lg items-center shadow-lg w-80 self-center">
          {/* Close Button */}
          <TouchableOpacity
            onPress={() => setShowQRCode(false)}
            className="absolute top-4 right-4"
          >
            <MaterialIcons name="close" size={24} color="#1d2951" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-primary mb-4">
            Student QR Code
          </Text>
          {/* QR Code Image (or loading message -> if still loading) */}
          {qrCode ? (
            <Image
              source={{ uri: qrCode }}
              className="mt-4 w-80 h-80"
              resizeMode="contain"
            />
          ) : (
            <Text className="text-lg text-gray-200">Loading QR Code...</Text>
          )}
        </View>
      </Modal>

      {/* Report Issue Modal */}
      <ReportIssueModal
        isVisible={showReportModal}
        onClose={() => setShowReportModal(false)}
        studentName={studentDetails.name}
        parentName={studentDetails.parent_name}
        parentEmail={studentDetails.parent_email}
      />
    </View>
  );
}
