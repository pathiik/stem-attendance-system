import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import { MaterialIcons, Octicons } from "@expo/vector-icons";
import { db } from "../../FirebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import DropDownPicker from "react-native-dropdown-picker";

// Props for the ReportIssueModal component
interface ReportIssueModalProps {
  isVisible: boolean;
  onClose: () => void;
  studentName: string;
  parentName: string;
  parentEmail: string;
}

// ReportIssueModal component for the app
export default function ReportIssueModal({
  isVisible,
  onClose,
  studentName,
  parentName,
  parentEmail,
}: ReportIssueModalProps) {
  const [issueType, setIssueType] = useState<string | null>(null); // State to store the type of issue
  const [description, setDescription] = useState(""); // State to store issue description
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for showing/hiding dropdown
  const [isSubmitting, setIsSubmitting] = useState(false); // State to set submission status
  const [wordCount, setWordCount] = useState(0); // State to store word count for description text

  // Pre-defined issue types
  const issueTypes = [
    { label: "Incorrect Student Information", value: "incorrect_info" },
    { label: "App Bug/Error", value: "app_bug" },
    { label: "Request for Information Change", value: "info_change" },
    { label: "Other Issue", value: "other" },
  ];

  const MAX_WORDS = 200; // Max words for description text

  // Function to check and handle word count for description
  const handleDescriptionChange = (text: string) => {
    const words = text.trim().split(/\s+/);
    if (words.length <= MAX_WORDS || text.length < description.length) {
      setDescription(text);
      setWordCount(words.length);
    }
  };

  // Function to handle report submission
  const handleSubmit = async () => {
    if (!issueType) {
      Alert.alert("Error", "Please select an issue type!");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description!");
      return;
    }

    setIsSubmitting(true);

    try {
      const messageId = `msg_${Date.now()}`;
      const messageRef = doc(db, "messages", messageId);

      // Update message database with new message
      await setDoc(messageRef, {
        message_id: messageId,
        subject:
          issueTypes.find((item) => item.value === issueType)?.label ||
          "Issue Report",
        description: description,
        student_name: studentName,
        sender_name: parentName,
        sender_email: parentEmail,
        status: "unread",
        created_at: serverTimestamp(),
      });

      Alert.alert("Success", "Issue reported successfully!");
      setIssueType(null);
      setDescription("");
      setWordCount(0);
      onClose();
    } catch (error) {
      console.error("Error reporting issue: ", error);
      Alert.alert("Error", "Failed to report issue.  Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      className="justify-center items-center m-0"
      backdropOpacity={0.5}
      statusBarTranslucent
    >
      <View className="bg-white p-6 rounded-lg max-h-[85%]">
        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          className="absolute top-6 right-6 z-10"
        >
          <MaterialIcons name="close" size={24} color="#1d2951" />
        </TouchableOpacity>

        {/* Modal Title */}
        <View className="items-center mb-4">
          <Text className="text-2xl font-bold text-primary">Report Issue</Text>
          <Text className="text-lg text-gray-600 mt-1">
            Regarding: {studentName}
          </Text>
        </View>

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {/* Issue Type Dropdown */}
          <View className="mb-5 z-50">
            <Text className="text-lg font-medium text-gray-800 mb-2">
              Issue Type
            </Text>
            <DropDownPicker
              open={isDropdownOpen}
              value={issueType}
              items={issueTypes}
              setOpen={setIsDropdownOpen}
              setValue={setIssueType}
              placeholder="Select an issue type"
              placeholderStyle={{ color: "#9ca3af" }}
              style={{
                backgroundColor: "#f9fafb",
                borderColor: "#d1d5db",
                borderRadius: 5,
                minHeight: 50,
              }}
              dropDownContainerStyle={{
                backgroundColor: "#f9fafb",
                borderColor: "#d1d5db",
                borderRadius: 5,
                marginTop: 5,
              }}
              textStyle={{
                fontSize: 16,
                color: "#1d2951",
              }}
              listMode="SCROLLVIEW"
              scrollViewProps={{
                nestedScrollEnabled: true,
              }}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          {/* Description Input */}
          <View className="mb-5">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-medium text-gray-800">
                Description
              </Text>
              <Text className="text-sm text-gray-500">
                {wordCount}/{MAX_WORDS} words
              </Text>
            </View>
            <TextInput
              className="border-2 border-gray-200 rounded-lg p-4 text-base bg-gray-50 text-gray-800"
              multiline
              textAlignVertical="top"
              placeholder="Please describe the issue in detail (max 200 words)..."
              placeholderTextColor="#9ca3af"
              value={description}
              onChangeText={handleDescriptionChange}
              style={{
                minHeight: 150,
                maxHeight: 200,
              }}
            />
          </View>
        </ScrollView>

        {/* Submit Button */}
        <TouchableOpacity
          className={`flex-row items-center justify-center gap-2 rounded-lg py-4 mt-2 ${
            isSubmitting ? "bg-primary/90" : "bg-primary"
          }`}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Octicons
            name="report"
            size={20}
            color="white"
            style={{ opacity: isSubmitting ? 0.8 : 1 }}
          />
          <Text className="text-lg font-bold text-white">
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
