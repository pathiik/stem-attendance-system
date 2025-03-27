import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// Student interface with student details
interface Student {
  student_id: string | number;
  name: string;
  status: "Present" | "Absent";
  age: number;
  address: string;
}

// Props for the StudentCard component
interface StudentCardProps {
  student: Student;
  onPress: () => void;
}

// Student Card component
export default function StudentCard({ student, onPress }: StudentCardProps) {
  return (
    <TouchableOpacity
      className="bg-white px-5 py-4 rounded-lg mb-4 shadow-2xl"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        {/* Placeholder for profile picture (if any) */}
        <View className="w-16 h-16 rounded-full bg-gray-200 justify-center items-center">
          <MaterialIcons name="person" size={30} color="#1d2951" />
        </View>
        <View className="ml-4 flex-1">
          {/* Student Name and Status */}
          <View className="flex-row justify-between items-center">
            <Text
              className="text-xl font-bold text-primary uppercase tracking-wide"
              numberOfLines={2}
              style={{ width: "70%" }}
            >
              {student.name}
            </Text>
            {/* Status Indicator */}
            <View
              className={`px-3 py-1 rounded-full ${
                student.status === "Present" ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  student.status === "Present"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {student.status}
              </Text>
            </View>
          </View>

          {/* Student Details Section */}
          <View className="flex-row items-center mt-1 gap-1">
            <MaterialIcons name="badge" size={16} color="#1d2951" />
            <Text className="text-sm text-gray-600">
              Student ID: {student.student_id}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="cake" size={16} color="#1d2951" />
            <Text className="text-sm text-gray-600">Age: {student.age}</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <MaterialIcons name="location-on" size={16} color="#1d2951" />
            <Text className="text-sm text-gray-600 ml-1" numberOfLines={1}>
              {student.address}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
