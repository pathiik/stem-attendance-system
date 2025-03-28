import { View, StyleSheet, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";

// CameraOverlay component for the camera view
export default function CameraOverlay() {
  // State to store the orientation of the device
  const [orientation, setOrientation] = useState(
    Dimensions.get("window").width > Dimensions.get("window").height
      ? "LANDSCAPE"
      : "PORTRAIT"
  );

  // Event listener to update the orientation state
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setOrientation(window.width > window.height ? "LANDSCAPE" : "PORTRAIT");
    });
    return () => subscription?.remove();
  }, []);

  return (
    // Container for the CameraOverlay component
    <View style={styles.container}>
      {/* Square Frame in the center */}
      <View
        style={[
          styles.frame,
          orientation === "LANDSCAPE"
            ? styles.landscapeFrame
            : styles.portraitFrame,
        ]}
      />
    </View>
  );
}

// Styles for the CameraOverlay component using StyleSheet
const styles = StyleSheet.create({
  // Styles for the main container
  container: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  // Styles for square frame in the center
  frame: {
    borderWidth: 5,
    borderColor: "white",
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  // Styles for portrait frame
  portraitFrame: {
    width: "70%",
    aspectRatio: 1,
  },
  // Styles for landscape frame
  landscapeFrame: {
    width: "45%",
    aspectRatio: 1,
  },
});
