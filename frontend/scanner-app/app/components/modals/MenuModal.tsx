import {
  View,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

// Props for the Menu Modal
interface MenuModalProps {
  visible: boolean;
  cameraFace: "front" | "back";
  onCameraFaceChange: () => void;
  onLogout: () => void;
  onClose: () => void;
}

// Menu Modal component
export default function ({
  visible,
  cameraFace,
  onCameraFaceChange,
  onLogout,
  onClose,
}: MenuModalProps) {
  // Return null if not visible
  if (!visible) return null;

  return (
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="absolute right-9 top-12 bg-white shadow-2xl rounded-lg px-6 py-4 z-20">
          {/* Logout Button */}
          <TouchableOpacity
            className="flex-row items-center gap-2 py-2"
            onPress={onLogout}
          >
            <MaterialIcons name="logout" size={22} color="#ef4444" />
            <Text className="text-red-500 ml-2 font-bold">Logout</Text>
          </TouchableOpacity>

          {/* Separator Line */}
          <View className="border-b border-gray-200 my-2" />

          {/* Camera Face Button */}
          <TouchableOpacity
            className="flex-row items-center gap-2 py-2"
            onPress={onCameraFaceChange}
          >
            <MaterialCommunityIcons
              name="camera-flip"
              size={22}
              color="#1d2951"
            />
            <View className="flex-col ml-2">
              <Text className="text-primary font-semibold">Camera Face</Text>
              <Text className="text-xs capitalize">{cameraFace}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
  );
}
