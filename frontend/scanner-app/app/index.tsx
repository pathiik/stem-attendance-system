import {
  Text,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import FunctionButton from "./components/FunctionButton";

// Main component
export default function Index() {
  // Loading state variable (is page still loading or not) -> currently unused
  const [loading, setLoading] = useState(false);

  //Greeting related state variables
  const languages = ["Hi", "Hola", "Bonjour"]; // Greeting languages (English, Spanish, French)
  const [greetingIndex, setGreetingIndex] = useState(0); // Current language index
  const [greetingText, setGreetingText] = useState(languages[0]); // Current greeting index
  const [timedGreeting, setTimedGreeting] = useState(""); // Timed greeting based on time of the day

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

  // Cycles through greeting languages every 15 seconds (Hi, Hola, Bonjour)
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prevIndex) => (prevIndex + 1) % languages.length);
    }, 15000);

    return () => clearInterval(interval); // Clearing interval on unmount
  }, []);

  // Updates greeting text and timed greeting when language changes
  useEffect(() => {
    const currentLanguage = languages[greetingIndex];
    setGreetingText(currentLanguage);
    setTimedGreeting(getTimesGreeting(currentLanguage));
  }, [greetingIndex]);

  // Loading screen (if data is not yet fetched -> currenly unused)
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#1d2951" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback>
      <View className="flex-1 bg-white">
        {/* Styling the status bar */}
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        {/* Gradient Background */}
        {/* Using 'style' instead of 'className' as it causes some issues with gradient in ios devices */}
        <View style={{ height: 200, position: "relative" }}>
          <LinearGradient
            colors={["#1D2951", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 200,
              zIndex: 0,
            }}
          />

          {/* Header section (with logo & three-dot menu) */}
          <View
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 50,
              zIndex: 10,
            }}
          >
            <View className="flex-row items-center justify-between px-5">
              {/* App Logo & Text */}
              <View className="flex-row items-center gap-3">
                <Image
                  source={require("../assets/stem-icon-light.png")}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
                <Text className="text-xl font-bold text-white">
                  STEM Attendance Scanner
                </Text>
              </View>

              {/* Three-dot menu icon (currently unused) */}
              <TouchableOpacity>
                <MaterialIcons name="more-vert" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Greeting Section */}
            <View className="px-5 mt-6">
              <Text className="text-4xl font-bold text-white tracking-wider px-1">
                {greetingText}, Teacher!
              </Text>
              <Text className="text-lg text-white mt-3 px-1">
                {timedGreeting}
              </Text>
            </View>
          </View>
        </View>

        {/* Function Buttons */}
        <View
          className="flex-row justify-center items-center mt-10"
          style={{ gap: 50 }}
        >
          {/* Sign In Button */}
          <FunctionButton
            text="Sign In"
            icon="login"
            color="green"
            action="sign-in"
          />

          {/* Sign Out Button */}
          <FunctionButton
            text="Sign Out"
            icon="logout"
            color="red"
            action="sign-out"
          />
        </View>
        <Text></Text>
      </View>
    </TouchableWithoutFeedback>
  );
}
