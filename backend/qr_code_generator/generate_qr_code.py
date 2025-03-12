# QR Code Generator
import qrcode
import openpyxl
import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader
from PIL import Image, ImageDraw, ImageFont  # Importing PIL for image manipulation

# Loading environment variables
load_dotenv()

# Setting paths and credentials from environment variables
FIREBASE_KEY_PATH = os.getenv("FIREBASE_KEY_PATH")
EXCEL_FILE_PATH = os.getenv("EXCEL_FILE_PATH") 
QR_FOLDER_PATH = os.getenv("QR_FOLDER_PATH")

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
            if not doc_ref.get().exists:
                doc_ref.set(student)
                upload_parent_data(student)
    except Exception as e:
        pass

# Function to upload parent data to Firebase
# Uploads the parent date and the children associated with the parent to Firebase Firestore
def upload_parent_data(student):
    try:
        db = firestore.client()
        parent_email = student['parent_email']
        parent_ref = db.collection('parents').document(parent_email)
        parent_doc = parent_ref.get()
        
        if parent_doc.exists:
            parent_data = parent_doc.to_dict()
            children = parent_data.get('children', [])
            if student['student_id'] not in [child['student_id'] for child in children]:
                children.append({
                    'student_id': student['student_id'],
                    'name': student['name']
                })
                parent_ref.update({'children': children})
        else:
            parent_data = {
                'parent_name': student['parent_name'],
                'parent_phone': student['parent_phone'],
                'parent_email': student['parent_email'],
                'children': [{
                    'student_id': student['student_id'],
                    'name': student['name']
                }]
            }
            parent_ref.set(parent_data)
    except Exception as e:
        pass

# Function to generate QR Code and save it locally
# Generates a QR Code from the student data and saves it as a PNG file locally
# Adds the student's name below the QR Code
def generate_qr_code(data, filename, student_name):
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
        img = img.convert("RGB")  # Convert image to RGB for compatibility with PIL

        # Creating a new image with space for text below the QR code
        qr_with_text = Image.new("RGB", (img.width, img.height + 70), "white")
        qr_with_text.paste(img, (0, 0))  # Pasting the QR code onto the new image

        # Drawing the student's name below the QR code
        draw = ImageDraw.Draw(qr_with_text)

        try:
            # Using 'arial.ttf' font if available
            font = ImageFont.truetype("arial.ttf", 28)
        except IOError:
            # Fallback to default font if the specified font is not available
            font = ImageFont.load_default()
            print("Warning: Custom font not found. Using default font.")

        text = f"Name: {student_name}"

        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]  

        # Drawing the text centered below the QR code
        draw.text(
            ((img.width - text_width) // 2, img.height + 20),  # Adjusted vertical position
            text,
            font=font,
            fill="black"
        )

        # Creating a QR Code folder if it doesn't exist
        os.makedirs(QR_FOLDER_PATH, exist_ok=True)
        file_path = os.path.join(QR_FOLDER_PATH, filename)
        qr_with_text.save(file_path)  # Save the new image with the QR code and text
        return file_path
    except Exception as e:
        print(f"Error generating QR code: {e}")
        return None

# Function to upload QR Code to Cloudinary
# Uploads the QR Code to Cloudinary and returns the public URL
def upload_to_cloudinary(file_path):
    try:
        response = cloudinary.uploader.upload(file_path, folder="qr_codes", public_id=os.path.basename(file_path).split('.')[0])
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
        if not doc_ref.get().exists:
            doc_ref.set({'qr_code_url': qr_url}, merge=True)
    except Exception as e:
        pass

# Main function
def main():
    students = read_student_data(EXCEL_FILE_PATH)
    if not students:
        print("No student data found. Exiting...")
        return
    
    upload_student_data(students)

    for student in students:
        # Checking if the QR code already exists in Firebase
        if firestore.client().collection('qr_codes').document(str(student['student_id'])).get().exists:
            print(f"QR code already exists for student ID: {student['student_id']}")
            continue
        
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
        
        qr_filename = f"{student['student_id']}_qr.png"  # QR Code filename

        # Generating QR Code with the student's name
        qr_file_path = generate_qr_code(qr_data, qr_filename, student['name'])
        if not qr_file_path:
            print(f"Failed to generate QR code for student ID: {student['student_id']}")
            continue
        
        # Uploading QR Code to Cloudinary
        qr_url = upload_to_cloudinary(qr_file_path)
        if not qr_url:
            print(f"Failed to upload QR code for student ID: {student['student_id']}")
            continue

        # Updating Firebase with QR Code URL
        update_firebase(qr_url, student['student_id'])
        print(f"Successfully processed student ID: {student['student_id']}")

if __name__ == "__main__":
    main()