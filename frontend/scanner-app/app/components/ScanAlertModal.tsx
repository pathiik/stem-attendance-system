import { View, Text, Modal } from "react-native";
import React from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

export default function ScanAlertModal() {
  const status = "Present";
  return (
    <Modal transparent={true} visible={true} animationType="slide">
      <View className="flex-1 justify-center items-center">
        <View
          className="flex items-center justify-center bg-white p-6 rounded-lg"
          style={{ width: 300 }}
        >
          <Text className="text-primary font-bold text-xl mb-3">
            Student ID Submitted
          </Text>
          <View className="flex-row items-center justify-between gap-3 mb-3">
            <AntDesign name="login" size={35} color="green" />
            <View>
              <Text
                className="text-lg font-semibold text-primary uppercase"
                style={{ maxWidth: 200 }}
                numberOfLines={2}
              >
                Pathik Bhattarai
              </Text>
              <View className="flex-row items-center gap-1">
                <MaterialIcons
                  name="badge"
                  size={16}
                  style={{ color: "gray" }}
                />
                <Text className="text-sm" style={{ color: "gray " }}>
                  ID: 1005
                </Text>
              </View>
            </View>
          </View>
          <View className="flex-row items-center justify-between gap-2">
            <Text className="text-sm font-medium text-gray-500">
              Status updated to
            </Text>
            <View
              className={`px-3 py-1 rounded-full ${
                status === "Present" ? "bg-green-100" : "bg-red-100"
              }`}
              style={{ width: 65 }}
            >
              <Text
                className={`text-sm font-semibold text-center ${
                  status === "Present" ? "text-green-700" : "text-red-700"
                }`}
              >
                {status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
