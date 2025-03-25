# STEM ATTENDANCE APP (SCANNER)

The Attendance App (for scanner) is a mobile application designed for teachers or authorized indivuals to scan student QR codes and mark attendance. Built using **Expo** and **React Native**, the app integrates with **Firebase** for real-time database management. It provides a seamless and efficient way update student attendance status using QR Codes (or Student ID).

![React Native](https://img.shields.io/badge/React_Native-61DAFB?logo=react&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?logo=expo&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white)

<!-- Animated Divider -->
<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>
</div>

## ✨ Key Features

| Feature                        | Description                            |
| ------------------------------ | -------------------------------------- |
| **Lightning-Fast Scanning ⚡** | Scan student QR codes in a snap!       |
| **Dynamic Greetings 🌍**       | Greetings in 3 languages based on time |
| **Real-Time Updates 🔄**       | Sync attendance data instantly         |
| **Beautiful UI 🎨**            | Modern design with Tailwind CSS        |

---

## 🧰 Tech Stack

### 📱 Core Dependencies

| Package        | Description            |
| -------------- | ---------------------- |
| `react-native` | Core framework         |
| `expo`         | React Native framework |
| `firebase`     | Realtime database      |

### 🎨 Styling & UI

| Package                          | Description               |
| -------------------------------- | ------------------------- |
| `nativewind tailwind`            | Tailwind CSS for styling  |
| `react-native-safe-area-context` | Ensures safe UI placement |
| `expo-linear-gradient`           | Gradient backgrounds      |

```bash
npm install nativewind tailwindcss react-native-safe-area-context expo-linear-gradient
```

### 📷 Camera & Scanning

| Package           | Description                                           |
| ----------------- | ----------------------------------------------------- |
| `expo-camera`     | Camera access for scanning QR codes                   |
| `expo-dev-client` | Expo development client (only for testing CameraView) |

```bash
npm install expo-camera
```

### 🗃️ Data Management

| Package                                     | Description               |
| ------------------------------------------- | ------------------------- |
| `firebase`                                  | Firebase SDK for database |
| `@react-native-async-storage/async-storage` | Asynchronous storage      |

```bash
npm install firebase @react-native-async-storage/async-storage
```

### 🚀 Navigation & Animation

| Package                                       | Description                               |
| --------------------------------------------- | ----------------------------------------- |
| `@react-navigation/native`                    | Navigation library                        |
| `@react-navigation/core react-native-screens` | Required for React navigation to function |
| `react-native-reanimated`                     | Animated transitions                      |

```bash
npm install @react-navigation/native @react-navigation/core react-native-screens react-native-reanimated
```

## 📂 Folder Structure

```
/scanner-app
│── .expo/                   # Expo development files 🛠️
│── app/                     # Main application code
│   ├── components/          # Reuasble react components (e.g. buttons, modals) 🧩
│   ├── screens/             # Application screens (e.g. ScanScreen) 🖥️
│   ├── globals.css          # Tailwind CSS global styles 🎨
│   ├── _layout.tsx          # Root layout and navigation setup 🌐
│   └── index.tsx            # Main entry point ⚡
│── assets/                  # Static assets (e.g., images, icons) 🖼️
│── node_modules/            # Project dependencies 📦
│── .gitignore               # Files and folders to ignore in Git 🚫
│── FirebaseConfig.ts        # Firebase configuration 🔥
│── metro.config.js          # Metro bundler configuration 🚚
│── babel.config.js          # Babel configuration 🎨
│── package.json             # Project dependencies and scripts 📦
│── tailwind.config.js       # Tailwind CSS configuration 🎨
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

### 3️⃣ Firebase Setup

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

**▶ Scan QR with Expo Go App**

## 📝 Notes

- 📷 Ensure the device has a working camera for QR code scanning.
- 🔥 Firebase configuration is required for database functionality.
- 📱 The app is optimized for both **Android** and **iOS** platforms.
