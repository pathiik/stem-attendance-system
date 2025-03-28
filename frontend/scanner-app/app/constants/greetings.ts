// List of greeting languages that the app supports
export const languages = ["Hi", "Hola", "Bonjour"] as const;

// Set the type of the language to be one of the languages
export type Language = (typeof languages)[number];

// Function to get the greeting based on the language and the time of the day
export const getTimedGreeting = (language: Language): string => {
  const hour = new Date().getHours();

  // Greetings based on the language
  const greetings = {
    Hi: {
      morning: "Good Morning!",
      afternoon: "Good Afternoon!",
      evening: "Good Evening!",
      night: "Have a good night!",
    },
    Hola: {
      morning: "¡Buenos días!",
      afternoon: "¡Buenas tardes!",
      evening: "¡Buenas noches!",
      night: "¡Buenas noches!",
    },
    Bonjour: {
      morning: "Bon matin!",
      afternoon: "Bon après-midi!",
      evening: "Bonsoir!",
      night: "Bonne nuit!",
    },
  };

  // Return the greeting based on the time of the day and the language
  if (hour < 12) return greetings[language].morning;
  if (hour < 17) return greetings[language].afternoon;
  if (hour < 21) return greetings[language].evening;
  return greetings[language].night;
};
