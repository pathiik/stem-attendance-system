# STEM ATTENDANCE SYSTEM (ADMIN DASHBOARD)

The Admin Dashboard is a web application designed for administrators to manage student attendance, and real-time monitoring. Built using **React** and **Tailwind CSS**, the dashboard integrates with **Firebase** for authentication and **Firestore** for real-time data synchronization.

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=for-the-badge)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwind-css&logoColor=white&style=for-the-badge)

<!-- Rainbow Divider -->
<div align="center">
  <img src="https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png" width="100%"/>
</div>

## 🔥 Key Features

| Feature                    | Description                                       |
| -------------------------- | ------------------------------------------------- |
| **Authentication 🔐**      | Login and Signup functionality using Firebase.    |
| **Real-Time Updates 🔄**   | Real-time data updates using Firebase Firestore.  |
| **Beautiful UI 🎨**        | Safe Area View and Flexbox for responsive design. |
| **Reusable Components ♻️** | Custom components for forms, buttons, and more.   |

---

## 🧰 Tech Stack

### 📱 Core Dependencies

| Package            | Description             |
| ------------------ | ----------------------- |
| `react`            | Core framework          |
| `vite`             | Build tool & dev server |
| `firebase`         | Firebase integration    |
| `react-router-dom` | Client-side routing     |

### 🎨 UI & Utilities

| Package       | Description                 |
| ------------- | --------------------------- |
| `tailwindcss` | Utility-first CSS framework |
| `react-icons` | Icon library                |

## 📂 Folder Structure

```
/admin-dashboard
│── node_modules/          # Project dependencies 📦
├── public/                # Static assets 🖼️
├── src/
│   ├── components/        # Reusable UI 🧩
│   ├── hooks/             # Custom hooks 🔗
│   ├── pages/
│   │   └── Auth/          # Authentication page 🔐
│   ├── App.jsx            # Root component 📦
│   ├── index.css          # Global styles 🎨
│   └── main.jsx           # Entry point for React 🔑
│── .gitignore             # Files and folders to ignore in Git 🚫
├── index.html             # Main HTML file 🏠
├── package.json           # Project metadata and dependencies 📜
├── README.md              # Project documentation 📖
└── vite.config.js         # Vite configuration file ⚙️
```

## 🛠️ Installation & Setup

### 1️⃣ Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (Recommended: LTS version) ➜ Download here: [Node.js](https://nodejs.org/)
- **Firebase Project** ➜ Create one at [Firebase Console](https://console.firebase.google.com/)

### 2️⃣ Install Dependencies

Navigate to the `admin-dashboard` folder and install the required dependencies:

```bash
npm install
```

### 3️⃣ Start the App

Run the development server:

```bash
npm run dev
```
