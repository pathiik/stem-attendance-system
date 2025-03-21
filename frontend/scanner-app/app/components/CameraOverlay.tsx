import { View, StyleSheet } from "react-native";
import React from "react";

// CameraOverlay component for the camera view
export default function CameraOverlay() {
  return (
    // Container for the CameraOverlay component
    <View style={styles.container}>
      {/* Top & Bottom Overlays covering the screen from top (32%) and bottom (35%) */}
      <View style={styles.topBottomOverlay} />
      <View style={[styles.topBottomOverlay, { height: "35%", bottom: 0 }]} />

      {/* Left & Right Overlays covering the screen from the sides (15% each) */}
      <View style={styles.sideOverlay} />
      <View style={[styles.sideOverlay, { right: 0 }]} />

      {/* Transparent Cutout Frame */}
      <View style={styles.frame} />
    </View>
  );
}

// Using styles instead of className (Tailwind CSS doesn't work as intended)
// Styles for the CameraOverlay component using StyleSheet
const styles = StyleSheet.create({
  // Styles for the main container
  container: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  // Styles for the top & bottom overlays (semi-transparent black bars)
  topBottomOverlay: {
    position: "absolute",
    width: "100%",
    height: "32%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  // Styles for the left & right overlays (semi-transparent black bars)
  sideOverlay: {
    position: "absolute",
    top: "32%",
    width: "15%",
    height: "33%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  // Styles for the transparent cutout frame in the center
  frame: {
    position: "absolute",
    top: "31.6%",
    left: "14%",
    width: "72%",
    aspectRatio: 1,
    borderWidth: 6,
    borderColor: "white",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
});
