import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Modal,
  StyleSheet,
} from "react-native";
import InCameraButton from "../buttons/InCameraButton";

// StudentIDModal component props with specific types
interface StudentIDModalProps {
  visible: boolean;
  studentID: string;
  onStudentIDChange: (text: string) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
}

// StudentIDModal component for the modal to enter student ID
export default function StudentIDModal({
  visible,
  studentID,
  onStudentIDChange,
  onSubmit,
  onToggleMode,
}: StudentIDModalProps) {
  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.7)" />
      <View
        className="flex-1 justify-center items-center absolute top-0 bottom-0 left-0 right-0"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
      >
        {/* Switch to QR Code Scanning */}
        <TouchableOpacity
          className="bg-gray-300 absolute top-20 p-1 rounded-xl"
          onPress={onToggleMode}
        >
          <InCameraButton buttonText="Scan QR Code" />
        </TouchableOpacity>

        <View className="bg-white p-6 rounded-lg" style={{ width: 300 }}>
          <Text className="text-lg font-bold text-primary text-center mb-3">
            Enter Student ID
          </Text>
          {/* Student ID Input Field */}
          <TextInput
            style={styles.input}
            placeholder="Student ID"
            value={studentID}
            onChangeText={onStudentIDChange}
            keyboardType="numeric"
            autoFocus={true}
          />
          <View className="flex-row space-between">
            {/* Submit Button */}
            <TouchableOpacity
              style={
                studentID.trim() ? styles.submitButton : styles.disabledButton
              }
              onPress={onSubmit}
              disabled={!studentID.trim()}
            >
              <Text
                className={
                  studentID.trim()
                    ? "text-white font-bold"
                    : "text-gray-500 font-bold"
                }
              >
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
  submitButton: {
    backgroundColor: "#1d2951",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
});
