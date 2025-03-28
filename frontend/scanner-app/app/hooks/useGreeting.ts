import { useState, useEffect } from "react";
import { languages, getTimedGreeting, Language } from "../constants/greetings";

// Custom hook to get the greeting based on the language and the time of the day
export const useGreeting = () => {
  const [greetingIndex, setGreetingIndex] = useState(0); // Index of the greeting language
  const [greetingText, setGreetingText] = useState<Language>(languages[0]); // Greeting language
  const [timedGreeting, setTimedGreeting] = useState(""); // Greeting based on the time of the day

  // Set the greeting text based on the greeting index
  useEffect(() => {
    const interval = setInterval(() => {
      setGreetingIndex((prev) => (prev + 1) % languages.length);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Set the greeting text and the timed greeting based on the greeting index
  useEffect(() => {
    const currentLanguage = languages[greetingIndex];
    setGreetingText(currentLanguage);
    setTimedGreeting(getTimedGreeting(currentLanguage));
  }, [greetingIndex]);

  return { greetingText, timedGreeting };
};
