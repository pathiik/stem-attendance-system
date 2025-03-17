import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { db } from "../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function StudentDetailsScreen() {
  const { student } = useLocalSearchParams();
  const studentDetails = JSON.parse(student as string);
  const [showMore, setShowMore] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCode, setQrCode] = useState("");

  // Function to format date from timestamp
  const formatDate = (timestamp: { seconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString();
  };

  // Fetch QR Code from Firestore when Show QR Code button is pressed
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

  return (
    <View className="flex-1 bg-white">
      {/* Styling the status bar */}
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Profile Picture and Name Section */}
      <View className="items-center mt-5">
        {/* Placeholder for profile picture (if any) */}
        <View className="w-24 h-24 rounded-full bg-gray-200 justify-center items-center">
          <MaterialIcons name="person" size={40} color="#1d2951" />
        </View>

        {/* Student Name and Status Section */}
        <View className="mt-2 items-center">
          <Text className="text-2xl font-bold text-primary uppercase tracking-wide">
            {studentDetails.name}
          </Text>
          {/* Student ID */}
          <View className="flex-row items-center gap-1">
            <Text className="text-lg my-1 text-gray-600">
              Student ID: {studentDetails.student_id}
            </Text>
          </View>
          {/* Staudent Status */}
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
      <ScrollView className="flex-1 px-5 py-7">
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

          {/* Location Section */}
          <View className="flex-row justify-center items-center mt-4 gap-1">
            <MaterialIcons name="location-on" size={20} color="#1d2951" />
            <Text className="text-lg text-gray-600">
              {studentDetails.address}
            </Text>
          </View>

          {/* Parent Information Section */}
          <View className="mt-4">
            <Text className="text-xl font-bold text-primary mb-2">
              Parent Information
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="w-1/3 items-center">
                <MaterialIcons name="group" size={60} color="#1d2951" />
              </View>
              <View className="w-2/3">
                <Text className="text-xl font-bold text-primary">
                  {studentDetails.parent_name}
                </Text>
                <View className="mt-2 space-y-1">
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="phone" size={16} color="#1d2951" />
                    <Text className="text-lg text-gray-600">
                      {studentDetails.parent_phone}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="email" size={16} color="#1d2951" />
                    <Text className="text-lg text-gray-600">
                      {studentDetails.parent_email}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

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
              {/* Emergency Information Section */}
              <Text className="text-xl font-bold text-primary mt-2">
                Emergency Information
              </Text>
              <View className="flex-row items-center gap-3 mt-2">
                <View className="w-1/3 items-center">
                  <MaterialIcons name="emergency" size={60} color="#1d2951" />
                </View>
                <View className="w-2/3">
                  <Text className="text-xl font-bold text-primary">
                    {studentDetails.emergency_contact_name}
                  </Text>
                  <View className="mt-2 space-y-1">
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="phone" size={16} color="#1d2951" />
                      <Text className="text-lg text-gray-600">
                        {studentDetails.emergency_contact_phone}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="email" size={16} color="#1d2951" />
                      <Text className="text-lg text-gray-600">
                        {studentDetails.emergency_contact_email}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

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
    </View>
  );
}
