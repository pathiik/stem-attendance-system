# STEM ATTENDANCE APP (SCANNER)

## 📌 Project Overview

The Attendance App (for scanner) is a mobile application designed for teachers (or authorized indivuals) to scan student QR codes and mark attendance. Built using **Expo** and **React Native**, the app integrates with **Firebase** for database.

## 📦 Dependencies Used

- `nativewind tailwindcss` - Tailwind CSS for styling
- `react-native-safe-area-context` - Ensures safe UI placement
- `react-native-reanimated` - Animated transitions
- `expo-linear-gradient` - Gradient backgrounds
- `expo-camera` - Camera access for scanning QR codes
- `expo-dev-client` - Expo development client (only for testing CameraView)
- `firebase` - Firebase SDK for database
- `react-native-dotenv` - Environment variables
- `npm install @types/react-native-dotenv` - Types for environment variables

### Install via npm

```bash
npm install nativewind tailwindcss react-native-safe-area-context react-native-reanimated expo-linear-gradient expo-camera firebase react-native-dotenv @types/react-native-dotenv
```

## 📂 Folder Structure

```
/scanner-app
│── .expo/                   # Expo development files
│── app/                     # Main application code
│   ├── components/          # Reuasble react components
│   ├── screens/             # Application screens
│   ├── globals.css          # Tailwind CSS global styles
│   ├── _layout.tsx          # Root layout and navigation setup
│   └── index.tsx            # Main entry point
│── assets/                  # Static assets (e.g., images, icons)
│── node_modules/            # Project dependencies
│── .gitignore               # Files and folders to ignore in Git
│── FirebaseConfig.ts        # Firebase configuration
│── global.d.ts              # Global types
│── metro.config.js          # Metro bundler configuration
│── babel.config.js          # Babel configuration
│── package.json             # Project dependencies and scripts
│── tailwind.config.js       # Tailwind CSS configuration
```

## 🛠️ Installation & Setup

### 1️⃣ Prerequisites

Ensure you have the following installed:

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

Install other required dependencies:

```bash
npm install nativewind tailwindcss react-native-safe-area-context react-native-reanimated expo-linear-gradient expo-camera
```

### 3️⃣ Set Up Firebase

- Create a **FirebaseConfig.js** file inside the `scanner-app` if it doesn't exist.
- Add your Firebase configuration:

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

### 4️⃣ Start the App

Run the Expo development server:

```bash
npx expo start
```

### 5️⃣ Test on Expo Go

- **On Android:** Scan the QR code using the Expo Go app.
- **On iOS:** Use the Camera app to scan the QR code.
