const greeting = {
  // Supported languages for greeting
  languages: ["Hi", "Hola", "Bonjour"],

  // Function to get timed greeting based on current time and language
  getTimedGreeting: (language: string) => {
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
  },
};

export default greeting;
