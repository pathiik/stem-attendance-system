# QR Code Generation Script
# March 11, 2025

import qrcode
import openpyxl
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

# Loading environment variables
load_dotenv()

# Setting paths and credentials from environment variables
FIREBASE_KEY_PATH = os.getenv("FIREBASE_KEY_PATH") # Path to Firebase service account key
EXCEL_FILE_PATH = os.getenv("EXCEL_FILE_PATH") # Path to Excel file containing student data
QR_FOLDER_PATH = os.getenv("QR_FOLDER_PATH") # Path to folder where QR codes will be saved

# Setting Cloudinary credentials
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

# Configuring Cloudinary
cloudinary.config(
    cloud_name = CLOUDINARY_CLOUD_NAME,
    api_key = CLOUDINARY_API_KEY,
    api_secret = CLOUDINARY_API_SECRET
)

# Initializing Firebase Admin SDK
cred = credentials.Certificate(FIREBASE_KEY_PATH)
firebase_admin.initialize_app(cred)

# Function to read student data from an Excel file
# Reads student data from an Excel file and returns a list of dictionaries
def read_student_data(file_path):
    try:
        workbook = openpyxl.load_workbook(file_path)
        sheet = workbook.active
        students = []
        for row in sheet.iter_rows(min_row=2, values_only=True): # Skipping the header row
            if len(row) < 13:
                print(f"Skipping incomplete row: {row}")
                continue
            student = {
                'student_id': row[0],
                'name': row[1],
                'age': row[2],
                'date_of_birth': row[3],
                'email': row[4],
                'address': row[5],
                'parent_name': row[6],
                'parent_phone': row[7],
                'parent_email': row[8],
                'emergency_contact_name': row[9],
                'emergency_contact_phone': row[10],
                'emergency_contact_email': row[11],
                'id_expiry_date': row[12]
            }
            students.append(student)
        return students
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return []
    
# Function to upload student data to Firebase
# Uploads the student data to Firebase Firestore
def upload_student_data(students):
    try:
        db = firestore.client()
        for student in students:
            doc_ref = db.collection('students').document(str(student['student_id']))
            doc_ref.set(student)
            print(f"Uploaded student data for student ID: {student['student_id']}")
    except Exception as e:
        print(f"Error uploading student data to Firebase: {e}")

# Function to generate QR Code and save it locally
# Generates a QR Code from the student data and saves it as a PNG file locally
def generate_qr_code(data, filename):
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)
        img = qr.make_image(fill_color="black", back_color="white")

        # Creating a QR Code folder if it doesn't exist
        os.makedirs(QR_FOLDER_PATH, exist_ok=True)
        file_path = os.path.join(QR_FOLDER_PATH, filename)
        img.save(file_path)
        return file_path
    except Exception as e:
        print(f"Error generating QR code: {e}")
        return None
    
# Function to upload QR Code to Cloudinary
# Uploads the QR Code to Cloudinary and returns the public URL
def upload_to_cloudinary(file_path):
    try:
        response = cloudinary.uploader.upload(file_path, folder = "qr_codes", public_id = os.path.basename(file_path).split('.')[0])
        return response['secure_url']
    except Exception as e:
        print(f"Error uploading to Cloudinary: {e}")
        return None
    
# Function to update Firebase with QR Code URL
# Updates Firebase Firestore with the QR Code URL for the specified student ID
def update_firebase(qr_url, student_id):
    try:
        db = firestore.client()
        doc_ref = db.collection('qr_codes').document(str(student_id))
        doc_ref.set({
            'qr_code_url': qr_url
        }, merge=True)
        print(f"Updated Firebase with QR Code URL for student ID: {student_id}")
    except Exception as e:
        print(f"Error updating Firebase: {e}")

# Main function
def main():
    students = read_student_data(EXCEL_FILE_PATH)
    if not students:
        print("No student data found. Exiting...")
        return
    
    upload_student_data(students)

    for student in students:
        qr_data = f"""
        Student ID: {student['student_id']}
        Name: {student['name']}
        Age: {student['age']}
        Date of Birth: {student['date_of_birth']}
        Email: {student['email']}
        Address: {student['address']}
        Parent Name: {student['parent_name']}
        Parent Phone: {student['parent_phone']}
        Parent Email: {student['parent_email']}
        Emergency Contact Name: {student['emergency_contact_name']}
        Emergency Contact Phone: {student['emergency_contact_phone']}
        Emergency Contact Email: {student['emergency_contact_email']}
        ID Expiry Date: {student['id_expiry_date']}
        """

        qr_filename = f"{student['student_id']}_qr.png" # QR Code filename

        # Generating QR Code
        qr_file_path = generate_qr_code(qr_data, qr_filename)
        if not qr_file_path:
            print(f"Error generating QR Code for student ID: {student['student_id']}")
            continue
        
        # Uploading QR Code to Cloudinary
        qr_url = upload_to_cloudinary(qr_file_path)
        if not qr_url:
            print(f"Error uploading QR Code for student ID: {student['student_id']}")
            continue

        # Updating Firebase with QR Code URL
        update_firebase(qr_url, student['student_id'])
        print(f"Successfully generated QR Code for student ID: {student['student_id']}")

if __name__ == "__main__":
    main()