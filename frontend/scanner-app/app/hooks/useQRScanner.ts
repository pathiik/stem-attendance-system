import { useState } from "react";
import { Alert } from "react-native";

// Props for QRScanner
interface QRData {
  organization: string;
  studentID: string;
  name: string;
}

// Hook for QR Scanner
export const useQRScanner = () => {
  const [scanned, setScanned] = useState(false); // State to track if QR code is scanned
  const [qrData, setQRData] = useState<QRData | null>(null); // State to store the parsed QR data

  // Function to parse the QR data
  const parseQRData = (data: string): QRData | null => {
    try {
      const lines = data.split("\n");
      const result: Partial<QRData> = {};

      // Parsing the lines of the QR data
      lines.forEach((line) => {
        const [key, value] = line.split(":").map((part) => part.trim());
        if (key && value) {
          if (key === "Organization") result.organization = value.toLowerCase();
          if (key === "Student ID") result.studentID = value;
          if (key === "Name") result.name = value;
        }
      });

      // Check if all the required fields are present
      if (!result.organization || !result.studentID || !result.name) {
        return null;
      }

      return result as QRData;
    } catch (error) {
      return null;
    }
  };

  // Function to handle scanned QR code
  const handleScannedQR = (data: string) => {
    if (scanned) return null;

    // Parsing the QR data
    const parsedData = parseQRData(data);
    if (!parsedData || parsedData.organization !== "stem canada") {
      Alert.alert(
        "Invalid QR Code",
        "Please scan a valid STEM Canada QR code."
      );
      return null;
    }

    setQRData(parsedData);
    setScanned(true);
    return parsedData;
  };

  // Function to reset the scanner
  const resetScanner = () => {
    setScanned(false);
    setQRData(null);
  };

  return { scanned, qrData, handleScannedQR, resetScanner };
};
