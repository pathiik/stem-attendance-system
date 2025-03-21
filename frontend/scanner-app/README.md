# STEM ATTENDANCE APP (SCANNER)

## 📌 Project Overview

The Attendance App (for scanner) is a mobile application designed for teachers or authorized indivuals to scan student QR codes and mark attendance. Built using **Expo** and **React Native**, the app integrates with **Firebase** for real-time database management. It provides a seamless and efficient way update student attendance status using QR Codes (or Student ID).

## 📦 Dependencies Used

- **Styling & UI**

  - `nativewind tailwindcss` - Tailwind CSS for styling
  - `react-native-safe-area-context` - Ensures safe UI placement
  - `expo-linear-gradient` - Gradient backgrounds

- **Camera & Scanning**

  - `expo-camera` - Camera access for scanning QR codes
  - `expo-dev-client` - Expo development client (only for testing CameraView)

- **Database**

  - `firebase` - Firebase SDK for database

- **Navigation**

  - `@react-navigation/native` - Navigation library
  - `@react-navigation/core react-native-screens` - Required for React navigation to function

- **Animation**

  - `react-native-reanimated` - Animated transitions

- **Storage**

  - `@react-native-async-storage/async-storage` - Asynchronous storage

### Install via npm

```bash
npm install nativewind tailwindcss react-native-safe-area-context react-native-reanimated expo-linear-gradient expo-camera firebase @react-navigation/native @react-navigation/core react-native-screens @react-native-async-storage/async-storage
```

## 📂 Folder Structure

```
/scanner-app
│── .expo/                   # Expo development files
│── app/                     # Main application code
│   ├── components/          # Reuasble react components (e.g. buttons, modals)
│   ├── screens/             # Application screens (e.g. ScanScreen)
│   ├── globals.css          # Tailwind CSS global styles
│   ├── _layout.tsx          # Root layout and navigation setup
│   └── index.tsx            # Main entry point
│── assets/                  # Static assets (e.g., images, icons)
│── node_modules/            # Project dependencies
│── .gitignore               # Files and folders to ignore in Git
│── FirebaseConfig.ts        # Firebase configuration
│── metro.config.js          # Metro bundler configuration
│── babel.config.js          # Babel configuration
│── package.json             # Project dependencies and scripts
│── tailwind.config.js       # Tailwind CSS configuration
```

## 🛠️ Installation & Setup

### 1️⃣ Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (Recommended: LTS version) ➜ Download here: [Node.js](https://nodejs.org/)
- **Expo CLI** ➜ Install globally using:
  ```bash
  npm install -g expo-cli
  ```
- **Firebase Project** ➜ Create one at [Firebase Console](https://console.firebase.google.com/)

### 2️⃣ Install Dependencies

Navigate to the `scanner-app` folder and install the required dependencies:

```bash
npm install
```

Install additional dependencies:

```bash
npm install nativewind tailwindcss react-native-safe-area-context react-native-reanimated expo-linear-gradient expo-camera firebase @react-navigation/native @react-navigation/core react-native-screens @react-native-async-storage/async-storage
```

### 3️⃣ Set Up Firebase

1. Create a **FirebaseConfig.js** file inside the `scanner-app` if it doesn't exist.
2. Add your Firebase configuration:

```ts
import { initializeApp } from "firebase/app";
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
const db = getFirestore(app);

export { app, db };
```

3. Replace the placeholders (`<API_KEY>`, `<AUTH_DOMAIN>`, etc.) with your Firebase project credentials.

### 4️⃣ Start the App

Run the Expo development server:

```bash
npx expo start
```

### 5️⃣ Test on Expo Go

- **On Android:** Scan the QR code using the Expo Go app.
- **On iOS:** Use the Camera app to scan the QR code.

## 🚀 Key Features

- **QR Code Scanning:** Scan student QR codes to mark attendance.

- **Dynamic Greetings:** Displays greetings in multiple languages (e.g., Hi, Hola, Bonjour) with time-based messages.

- **Real-Time Updates:** Syncs attendance data with Firebase Firestore.

- **Responsive UI:** Built with Tailwind CSS for consistent styling across devices.

- **Easy Navigation:** Seamless navigation between screens using React Navigation.

## 📝 Notes

- Ensure the device has a working camera for QR code scanning.
- Firebase configuration is required for database functionality.
- The app is optimized for both Android and iOS platforms.
