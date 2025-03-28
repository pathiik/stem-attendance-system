import { useState, useEffect } from "react";
import { useCameraPermissions } from "expo-camera";

// Custom hook to use the camera and its permissions
export const useCamera = (initialFace: "front" | "back") => {
  const [permission, requestPermission] = useCameraPermissions(); // State for camera permission
  const [cameraFace, setCameraFace] = useState(initialFace); // Local state for camera facing direction (only in Scan Screen)

  // Request camera permission if not already granted
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Toggle between front and back camera
  const toggleCameraFace = () => {
    setCameraFace((prev) => (prev === "front" ? "back" : "front"));
  };

  return {
    permission,
    cameraFace,
    toggleCameraFace,
    requestPermission,
  };
};
