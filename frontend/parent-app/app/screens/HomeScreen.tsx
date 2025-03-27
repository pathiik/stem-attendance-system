import {
  Text,
  View,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import StudentCard from "../components/StudentCard";
import greeting from "../utils/greeting";

import { useAuth } from "../hooks/useAuth";
import { useStudents } from "../hooks/useStudents";
import { ROUTES } from "../constants/routes";

// Main component
export default function Index() {
  const [showMenu, setShowMenu] = useState(false); // State for showing/hiding logout menu

  // Greeting related state variables
  const [greetingIndex, setGreetingIndex] = useState(0); // Current language index
  const [greetingText, setGreetingText] = useState(greeting.languages[0]); // Current greeting index
  const [timedGreeting, setTimedGreeting] = useState(""); // Timed greeting based on time of the day

  const { user, loading: authLoading, logout } = useAuth(); // Auth hook
  const {
    parentName,
    studentDetails,
    loading: studentsLoading,
  } = useStudents(); // Students hook
  const loading = authLoading || studentsLoading; // Combined loading state

  const handleScreenPress = () => {
    setShowMenu(false);
  };

  // Cycling through greeting languages every 15 seconds (Hi, Hola, Bonjour)
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex(
        (prevIndex) => (prevIndex + 1) % greeting.languages.length
      );
    }, 15000);

    return () => clearInterval(interval); // Clearing interval on unmount
  }, []);

  // Updates greeting text and timed greeting when language changes
  useEffect(() => {
    const currentLanguage = greeting.languages[greetingIndex];
    setGreetingText(currentLanguage);
    setTimedGreeting(greeting.getTimedGreeting(currentLanguage));
  }, [greetingIndex]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#1d2951" />
      </View>
    );
  }

  return (
    <Pressable
      className="flex-1 bg-white"
      onPress={handleScreenPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}
    >
      {/* Status bar styling */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <Header
        parentName={parentName || ""}
        greetingText={greetingText}
        timedGreeting={timedGreeting}
        onLogout={logout}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
      />

      {/* Children List */}
      <ScrollView
        className="flex-1 px-5 py-7"
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {studentDetails.length > 0 ? (
          studentDetails.map((student) => (
            <StudentCard
              key={student.student_id}
              student={student}
              onPress={() =>
                router.push({
                  pathname: ROUTES.STUDENT_DETAILS,
                  params: {
                    student: JSON.stringify(student),
                  },
                })
              }
            />
          ))
        ) : (
          <Text className="text-lg text-center text-gray-500">
            No children found.
          </Text>
        )}
      </ScrollView>
    </Pressable>
  );
}
