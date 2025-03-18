# STEM ATTENDANCE APP (PARENT)

## 📌 Project Overview

The Attendance App (for parent) is a mobile application designed for parents to monitor their children's attendance. Built using **Expo** and **React Native**, the app integrates with **Firebase** for authentication and **Firestore** for real-time data updates.

## 🔥 Key Features

1. **Authentication:** Login and Signup functionality using Firebase.
2. **Real-Time Database:** Real-time data updates using Firebase Firestore.
3. **Navigation System:** Navigation between screens using Expo Router (`expo-router`).
4. **Responsive UI:** Safe Area View and Flexbox for responsive design including gradient effects and modals.
5. **User Management:** Profile retrieval and sign out functionality.

---

## 🛠️ How It Works

### Authentication

- Parents can login or signup using their email and password.
- Only parents with email registered in Firestore can create accounts.
- The authentication state is observed using `onAuthStateChanged`, redirecting the parents accordingly.

### Student Data Handling

- Student details are fetched from Firestore based on the parent's account using `onSnapshot`.
- Data is displayed in real-time and updated immediately when changes are made.
- Parents can view their child's profile dynamically.

### Navigation

- The app uses **expo-router** for seamless navigation.
- Screens are dynamically loaded based on user interaction.

## 📦 Dependencies Used

- `react-native` - Core framework
- `expo` - Development environment
- `expo-router` - Navigation system
- `firebase` - Firebase authentication & database
- `react-native-safe-area-context` - Ensures safe UI placement
- `react-native-modal` - Custom modal support
- `expo-linear-gradient` - Gradient effects
- `nativewind` - Tailwind CSS for styling
- `@expo/vector-icons` - Icon support

### Installed via npm

```bash
npm install expo-router firebase react-native-safe-area-context react-native-modal expo-linear-gradient nativewind tailwindcss @expo/vector-icons
```

---

## Other Features

### Dynamic Greetings

- The app displays greetings in multiple languages (English, Spanish, French) that cycle every 15 seconds.
- Greetings change based on the time of the day (e.g., "Good Morning," "Good Afternoon").

### QR Code Generation

- QR Codes are fetched from Firestore and displayed in a modal for each student.
- The QR codes can be scaned to log a student in and out of the system.

### Real-Time Data Sync

- The app listens to Firestore for real-time updates.
- Any changes in the student's attendance status or details are reflected immediately.

## 📂 Folder Structure

```
/parent-app
│── .expo/                   # Expo development files
│── app/                     # Main application code
│   ├── components/          # Reusable components (e.g., AuthTabs)
│   ├── screens/             # Application screens (e.g., AuthScreen, StudentDetailsScreen)
│   ├── globals.css          # Tailwind CSS global styles
│   ├── _layout.tsx          # Root layout and navigation setup
│   └── index.tsx            # Main entry point
│── assets/                  # Static assets (e.g., images, icons)
│── node_modules/            # Project dependencies
│── .gitignore               # Files and folders to ignore in Git
│── FirebaseConfig.js        # Firebase configuration
│── metro.config.js          # Metro bundler configuration
│── babel.config.js          # Babel configuration
│── package.json             # Project dependencies and scripts
│── tailwind.config.js       # Tailwind CSS configuration
```

## 🚀 Possible Improvements

- **Push Notifications:** Notify parents about attendance updates.
- **Dark Theme:** Allow the parents to choose between light and dark mode.
- **Multi-Language Support:** Add more languages for the entire app.
- **Feedback System:** Allow parents to provide feedback or report issues.
- **Performance Optimizations:** Reduce re-renders and optimize Firestore queries.

## Installation & Setup

### 1️⃣ Prerequisites

Ensure you have the following installed:

- **Node.js** (Recommended: LTS version) ➜ Download here: [Node.js](https://nodejs.org/)
- **Expo CLI** ➜ Install globally using:
  ```bash
  npm install -g expo-cli
  ```
- **Firebase Project** ➜ Create one at [Firebase Console](https://console.firebase.google.com/)

### 2️⃣ Install Dependencies

Navigate to the `parent-app` folder and install the required dependencies:

```bash
npm install
```

### 3️⃣ Set Up Firebase

- Create a **FirebaseConfig.ts** file inside the `parent-app` if it doesn't exist.
- Add your Firebase configuration:

```bash
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: <"API_KEY">,
  authDomain: <"AUTH_DOMAIN">,
  projectId: <"PROJECT_ID">,
  storageBucket: <"STORAGE_BUCKET">,
  messagingSenderId: <"MESSAGING_SENDER_ID">,
  appId: <"APP_ID">,
  measurementId: <"MEASUREMENT_ID">,
  };

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { app, auth, db };
```

### 4️⃣ Start the App

Run the Expo development server:

```bash
npx expo start
```

### 5️⃣ Test on Expo Go

- **On Android:** Scan the QR code using the Expo Go app.
- **On iOS:** Use the Camera app to scan the QR code.

## 🚀 Deployment

Once the app is stable, you can build using standalone versions:

```bash
expo build:android
expo build:ios
```
