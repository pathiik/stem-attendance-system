import { useState } from "react";
import { useParams, Link } from "react-router-dom";

import { FiUser, FiMail, FiArrowLeft } from "react-icons/fi";
import EditableField from "../../../components/ui/EditableFields";

// TeacherDetails - A component to display and edit teacher details
export default function TeacherDetails() {
  const { id } = useParams(); // Get the teacher ID from the URL parameters
  const [teacher, setTeacher] = useState({
    id,
    name: `Teacher ${id}`,
    email: `teacher_${id}@stem.ca`,
    subject: ["Math", "Science", "Technology", "Engineering"][
      Math.floor(Math.random() * 4)
    ], // RANDOM SUBJECT FOR DEMO
    status: "Active",
  });

  // Handles field updates
  const handleFieldUpdate = (field, value) => {
    setTeacher((prev) => ({ ...prev, [field]: value }));
    // TODO: Call API to update the teacher's field (CURRENTLY IN PRODUCTION)
    console.log(`Updated ${field} to ${value}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="p-4 border-b flex items-center">
        <Link
          to="/teachers"
          className="flex items-center text-blue-600 hover:underline"
        >
          <FiArrowLeft className="mr-2" />
          Back to Teachers
        </Link>
      </div>

      {/* Teacher Details Section */}
      <div className="p-6">
        <div className="flex items-start mb-6">
          <div className="bg-gray-100 p-3 rounded-full mr-4">
            <FiUser size={20} className="text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Teacher Details
            </h1>
            <p className="text-gray-600">ID: {id}</p>
          </div>
        </div>

        {/* Editable Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <EditableField
              label="Full Name"
              value={teacher.name}
              onSave={(value) => handleFieldUpdate("name", value)}
              icon={<FiUser />}
            />
            <EditableField
              label="Email"
              value={teacher.email}
              onSave={(value) => handleFieldUpdate("email", value)}
              icon={<FiMail />}
              inputType="email"
            />
          </div>

          <div className="space-y-4">
            <EditableField
              label="Subject"
              value={teacher.subject}
              onSave={(value) => handleFieldUpdate("subject", value)}
            />
            <EditableField
              label="Status"
              value={teacher.status}
              onSave={(value) => handleFieldUpdate("status", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
