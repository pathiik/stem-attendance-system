# STEM ATTENDANCE APP (SCANNER)

## 📌 Project Overview

The Attendance App (for scanner) is a mobile application designed for teachers (or authorized indivuals) to scan student QR codes and mark attendance. Built using **Expo** and **React Native**, the app integrates with **Firebase** for database.

## 📦 Dependencies Used

- `nativewind tailwindcss` - Tailwind CSS for styling
- `react-native-safe-area-context` - Ensures safe UI placement

### Install via npm

```bash
npm install nativewind tailwindcss react-native-safe-area-context
```

## 📂 Folder Structure

```
/scanner-app
│── .expo/                   # Expo development files
│── app/                     # Main application code
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

## 🛠️ Installation & Setup

### 1️⃣ Prerequisites

Ensure you have the following installed:

- **Node.js** (Recommended: LTS version) ➜ Download here: [Node.js](https://nodejs.org/)
- **Expo CLI** ➜ Install globally using:
  ```bash
  npm install -g expo-cli
  ```

### 2️⃣ Install Dependencies

Navigate to the `scanner-app` folder and install the required dependencies:

```bash
npm install
```

Install other required dependencies:

```bash
npm install nativewind tailwindcss react-native-safe-area-context
```

### 3️⃣ Start the App

Run the Expo development server:

```bash
npx expo start
```

### 4️ Test on Expo Go

- **On Android:** Scan the QR code using the Expo Go app.
- **On iOS:** Use the Camera app to scan the QR code.