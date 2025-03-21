# QR Code Generation Script

## 📌 Overview

This script generates QR codes for students based on data from an Excel file, uploads the QR codes to Cloudinary, and updates a Firebase Firestore database with the QR code URLs. The QR codes contain student details and are stored in a designated folder before being uploaded. Additionally, the script logs student activities (e.g., check-in/check-out) and updates their status in Firebase.

## 📦 Prerequisites

Before running the script, ensure you have the following installed:

- Python 3.x 🐍
- Required Python libraries:
  - `qrcode` (for QR code generation) 🖼️
  - `openpyxl` (for reading Excel files) 📊
  - `firebase-admin` (for Firebase authentication and Firestore access) 🔥
  - `python-dotenv` (for managing environment variables) 🔑
  - `cloudinary` (for uploading images to Cloudinary) ☁️
  - `Pillow` (for image manipulation, such as adding text below the QR code) 🖌️

## 🛠️ Installation

1. Install the required libraries using pip:

   ```sh
   pip install qrcode openpyxl firebase-admin python-dotenv cloudinary Pillow
   ```

2. Set up Firebase:

   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/). 🔥
   - Generate a service account key (JSON file) from the Firebase Console.
   - Place the JSON key file in a secure location.

3. Set up Cloudinary:

   - Create an account at [Cloudinary](https://cloudinary.com/). ☁️
   - Get your Cloud Name, API Key, and API Secret from the Cloudinary dashboard.

4. Create a `.env` file in the project directory to store environment variables:
   ```sh
   FIREBASE_KEY_PATH=<path_to_firebase_key>
   EXCEL_FILE_PATH=<path_to_excel_file>
   QR_FOLDER_PATH=<path_to_qr_folder>
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
   CLOUDINARY_API_KEY=<your_cloudinary_api_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
   ```

## 📂 Folder Structure

```
/qr_code_generator
│── .env                      # Environment variables file 🔑
│── firebase-key.json         # Firebase service account key (ignored in Git) 🔥
│── students.xlsx             # Excel file containing student data 📊
│── generate_qr_code.py       # The main Python script 🐍
│── qr_codes/                 # Directory to store generated QR codes 🖼️
```

## 📊 Excel File Format (`students.xlsx`)

The Excel file should have the following columns:

| student_id | name     | age | date_of_birth | email            | address     | parent_name | parent_phone | parent_email     | emergency_contact_name | emergency_contact_phone | emergency_contact_email | id_expiry_date |
| ---------- | -------- | --- | ------------- | ---------------- | ----------- | ----------- | ------------ | ---------------- | ---------------------- | ----------------------- | ----------------------- | -------------- |
| 101        | John Doe | 16  | 2008-05-12    | john@example.com | 123 Main St | Jane Doe    | 647-555-1234 | jane@example.com | Mark Smith             | 437-555-5678            | mark@example.com        | 2025-12-31     |

## 🚀 How It Works

1. The script reads student data from `students.xlsx`. 📊
2. It generates a unique QR code for each student containing their details. 🖼️
3. The student's name is added below the QR code using the `Pillow` library. 🖌️
4. Each QR code is saved as a PNG file inside the `qr_codes/` folder. 📁
5. The QR code is uploaded to Cloudinary. ☁️
6. The Firebase Firestore database is updated with the QR code URL and student details. 🔥
7. Parent data is also uploaded to Firebase, linking parents to their children. 👨‍👩‍👧‍👦
8. Student activities (e.g., check-in/check-out) are logged in Firebase with timestamps, and their status is updated accordingly. ⏰

## 🏃 Running the Script

To execute the script, run:

```sh
python generate_qr_code.py
```

## 🖼️ Expected Output

- QR codes are saved inside the `qr_codes/` folder as `<student_id>_qr.png`. 📁
- QR codes are uploaded to Cloudinary, and their URLs are stored in Firebase Firestore. ☁️🔥
- Parents data is linked to their children in Firebase. 👨‍👩‍👧‍👦
- Student activities are logged in Firebase, and their status is updated. ⏰
- The script prints messages confirming QR code generation, Cloudinary uploads, and Firebase updates. ✅

## 🛠️ Troubleshooting

- If Firebase authentication fails, ensure the service account key is correctly placed and referenced in `.env`. 🔥
- If Cloudinary upload fails, check your Cloudinary API credentials. ☁️
- Verify that the required libraries are installed using `pip list`. 📦
- Ensure `students.xlsx` follows the correct format. 📊
- If QR codes are not being generated, check for missing or incorrectly formatted data in the Excel file. 🖼️
- If the font for the student's name below the QR code is not found, the script will fall back to the default font. 🖌️

## 🚀 Future Improvements

- Implement logging for better debugging and tracking. 📝
- Improve error handling and retry mechanisms. 🔄
- Add a graphical user interface (GUI) for easier use. 🖥️
- Optimize QR code storage and retrieval in Firebase. 🔥
- Add support for custom fonts and additional text formatting below the QR code. 🖌️
- Enhance activity logging with additional details (e.g., location, device used). 📍📱

## 🔒 `.gitignore` File

To prevent sensitive files from being uploaded to GitHub, create a `.gitignore` file with the following content:

```
# Ignore environment variables
.env

# Ignore Firebase credentials
firebase-key.json

# Ignore Excel files
*.xlsx

# Ignore the QR code folder
qr_codes/
```
