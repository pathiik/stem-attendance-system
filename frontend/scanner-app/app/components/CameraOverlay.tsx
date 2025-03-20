import { View, StyleSheet } from "react-native";
import React from "react";

export default function CameraOverlay() {
  return (
    // Using styles instead of className (Tailwind CSS doesn't work as intended)
    <View style={styles.container}>
      {/* Top & Bottom Overlays */}
      <View style={styles.topBottomOverlay} />
      <View style={[styles.topBottomOverlay, { height: "35%", bottom: 0 }]} />

      {/* Left & Right Overlays */}
      <View style={styles.sideOverlay} />
      <View style={[styles.sideOverlay, { right: 0 }]} />

      {/* Transparent Cutout Frame */}
      <View style={styles.frame} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  topBottomOverlay: {
    position: "absolute",
    width: "100%",
    height: "32%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  sideOverlay: {
    position: "absolute",
    top: "32%",
    width: "15%",
    height: "33%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
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
