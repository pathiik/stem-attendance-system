import {
  Text,
  View,
  StatusBar,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../FirebaseConfig";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  // Declaring state variables
  const [parentName, setParentName] = useState<string | null>(null);
  const [studentDetails, setStudentDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false); // For showing/hiding logout menu

  //Setting greeting related state variables
  const languages = ["Hi", "Hola", "Bonjour"];
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [greetingText, setGreetingText] = useState(languages[0]);
  const [timedGreeting, setTimedGreeting] = useState("");

  // Function to get timed greeting based on the current time and selected language
  const getTimesGreeting = (language: string) => {
    const hour = new Date().getHours();
    if (hour < 12) {
      switch (language) {
        case "Hi":
          return "Good Morning!";
        case "Hola":
          return "¡Buenos días!";
        case "Bonjour":
          return "Bon matin!";
        default:
          return "Good Morning!";
      }
    } else if (hour < 17) {
      switch (language) {
        case "Hi":
          return "Good Afternoon!";
        case "Hola":
          return "¡Buenas tardes!";
        case "Bonjour":
          return "Bon après-midi!";
        default:
          return "Good Afternoon!";
      }
    } else if (hour < 21) {
      switch (language) {
        case "Hi":
          return "Good Evening!";
        case "Hola":
          return "¡Buenas noches!";
        case "Bonjour":
          return "Bonsoir!";
        default:
          return "Good Evening!";
      }
    } else {
      switch (language) {
        case "Hi":
          return "Have a good night!";
        case "Hola":
          return "¡Buenas noches!";
        case "Bonjour":
          return "Bonne nuit!";
        default:
          return "Have a good night!";
      }
    }
  };

  // Cycling through greeting languages every 15 seconds (Hi, Hola, Bonjour)
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prevIndex) => (prevIndex + 1) % languages.length);
    }, 15000);

    return () => clearInterval(interval); // Clearing interval on unmount
  }, []);

  // Updating greeting text and timed greeting when language changes
  useEffect(() => {
    const currentLanguage = languages[greetingIndex];
    setGreetingText(currentLanguage);
    setTimedGreeting(getTimesGreeting(currentLanguage));
  }, [greetingIndex]);

  // Fetching parent and children data from Firestore
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/screens/AuthScreen"); // Redirecting to login screen if no user
        setLoading(false);
        return;
      }

      const parentEmail = user.email;
      if (!parentEmail) {
        setLoading(false);
        return;
      }

      try {
        const parentDocRef = doc(db, "parents", parentEmail);

        // Real-time listener for parent database
        const unsubscribeParent = onSnapshot(parentDocRef, (parentDocSnap) => {
          if (parentDocSnap.exists()) {
            const parentData = parentDocSnap.data();
            const firstName = parentData.parent_name.split(" ")[0];
            setParentName(firstName || "Parent");

            if (Array.isArray(parentData.children)) {
              // Setting up listeners for each student document
              const unsubscribeStudents = parentData.children.map((child) => {
                const studentDocRef = doc(
                  db,
                  "students",
                  child.student_id.toString()
                );

                return onSnapshot(studentDocRef, (studentDocSnap) => {
                  if (studentDocSnap.exists()) {
                    const studentData = studentDocSnap.data();
                    setStudentDetails((prevDetails) => {
                      const updatedDetails = [...prevDetails];
                      const index = updatedDetails.findIndex(
                        (detail) => detail.student_id === studentData.student_id
                      );

                      if (index !== -1) {
                        updatedDetails[index] = studentData;
                      } else {
                        updatedDetails.push(studentData);
                      }
                      return updatedDetails;
                    });
                  }
                });
              });

              // Setting loading to false after setting up all listeners
              setLoading(false);

              return () => unsubscribeStudents.forEach((unsub) => unsub());
            }
          }
          setLoading(false);
        });

        return () => unsubscribeParent();
      } catch (error) {
        console.error("Error fetching parent or children data:", error);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth listener
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/screens/AuthScreen");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Shows loading spinner while fetching data
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#1d2951" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
      <View className="flex-1 bg-white">
        {/* Styling the status bar */}
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Gradient Background */}
        {/* Using 'style' instead of 'className' as it was causing some issues with gradient in ios devices */}
        <View style={{ height: 200, position: "relative" }}>
          <LinearGradient
            colors={["#1d2951", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 200,
              zIndex: 0,
            }}
          />

          {/* Header and Greeting (placed inside absolute view so they overlay the gradient) */}
          <View
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            {/* Header with logo and three-dot menu */}
            <View className="flex-row justify-between items-center px-5">
              <View className="flex-row items-center gap-3">
                <Image
                  source={require("../assets/stem-icon-light.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
                <Text className="text-xl font-bold text-white">
                  Attendance App (Parent)
                </Text>
              </View>

              {/* Three-dot menu icon */}
              <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
                <MaterialIcons name="more-vert" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Logout Menu */}
            {showMenu && (
              <View className="absolute right-4 top-10 bg-white shadow-2xl rounded-lg px-6 py-4 z-20">
                <TouchableOpacity
                  onPress={handleLogout}
                  className="flex-row items-center gap-2"
                >
                  <MaterialIcons name="logout" size={20} color="#ef4444" />
                  <Text className="text-red-500 ml-2 font-bold">Logout</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Greeting Section */}
            <View className="px-5 mt-6">
              <Text className="text-4xl font-bold text-white tracking-wider px-1">
                {greetingText}, {parentName || "Parent"}!
              </Text>
              <Text className="text-lg text-white mt-3 px-1">
                {timedGreeting}
              </Text>
            </View>
          </View>
        </View>

        {/* Children List */}
        <ScrollView
          className="flex-1 px-5 py-7"
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {studentDetails.length > 0 ? (
            studentDetails.map((student, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white px-5 py-4 rounded-lg mb-4 shadow-2xl"
                onPress={() => {
                  router.push({
                    pathname: "./screens/StudentDetailsScreen",
                    params: { student: JSON.stringify(student) },
                  });
                }}
              >
                <View className="flex-row items-center">
                  {/* Placeholder for profile picture (if any) */}
                  <View className="w-16 h-16 rounded-full bg-gray-200 justify-center items-center">
                    <MaterialIcons name="person" size={30} color="#1d2951" />
                  </View>
                  <View className="ml-4 flex-1">
                    {/* Student Name and Status Text */}
                    <View className="flex-row justify-between items-center">
                      <Text
                        className="text-xl font-bold text-primary uppercase tracking-wide"
                        numberOfLines={2}
                        style={{ width: "70%" }}
                      >
                        {student.name}
                      </Text>
                      {/* Status Text */}
                      <View
                        className={`px-3 py-1 rounded-full ${
                          student.status === "Present"
                            ? "bg-green-100"
                            : "bg-red-100"
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

                    {/* Student Details */}
                    <View className="flex-row items-center mt-1 gap-1">
                      <MaterialIcons name="badge" size={16} color="#1d2951" />
                      <Text className="text-sm text-gray-600">
                        Student ID: {student.student_id}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="cake" size={16} color="#1d2951" />
                      <Text className="text-sm text-gray-600">
                        Age: {student.age}
                      </Text>
                    </View>
                    <View className="flex-row items-center mt-1">
                      <MaterialIcons
                        name="location-on"
                        size={16}
                        color="#1d2951"
                      />
                      <Text
                        className="text-sm text-gray-600 ml-1"
                        numberOfLines={1}
                      >
                        {student.address}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-lg text-gray-500">No children found.</Text>
          )}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
