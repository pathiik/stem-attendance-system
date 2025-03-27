import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface ContactInfoCardProps {
  title: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  name: string;
  phone: string | number;
  email: string;
  iconSize?: number;
}

export default function ContactInfoCard({
  title,
  iconName,
  name,
  phone,
  email,
  iconSize = 60,
}: ContactInfoCardProps) {
  return (
    <View className="mt-4">
      <Text className="text-xl font-bold text-primary mb-2">
        {title}
      </Text>
      <View className="flex-row items-center justify-center gap-2">
        <View className="w-1/3 items-center">
          <MaterialIcons name={iconName} size={iconSize} color="#1d2951" />
        </View>
        <View className="w-2/3 pr-5">
          {/* Parent Name */}
          <Text className="text-xl font-bold text-primary" numberOfLines={2}>
            {name}
          </Text>
          <View className="mt-2 space-y-1">
            {/* Parent Phone (+ Icon) */}
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="phone" size={16} color="#1d2951" />
              <Text className="text-lg text-gray-600">
                {phone}
              </Text>
            </View>
            {/* Parent Email (+ Icon) */}
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="email" size={16} color="#1d2951" />
              <Text className="text-lg text-gray-600" numberOfLines={2}>
                {email}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
