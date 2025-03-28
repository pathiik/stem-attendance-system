import { useState } from "react";

// Custom hook to toggle manual entry
export const useManualEntry = () => {
  const [manualEntry, setManualEntry] = useState(false); // State to track if manual entry is enabled
  const [studentID, setStudentID] = useState(""); // State to store the student ID
  const [modalVisible, setModalVisible] = useState(false); // State to track if the modal is visible

  // Function to toggle manual entry and modal visibility
  const toggleManualEntry = () => {
    setManualEntry((prev) => !prev);
    setModalVisible((prev) => !prev);
  };

  return {
    manualEntry,
    studentID,
    setStudentID,
    modalVisible,
    setModalVisible,
    toggleManualEntry,
  };
};
