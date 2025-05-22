import { useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useParams, Link } from "react-router-dom";

import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiArrowLeft,
  FiCreditCard,
  FiEdit,
  FiLock,
} from "react-icons/fi";

import { db, auth } from "../../../firebase/config";
import { useAuth } from "../../../context/AuthContext";
import { useStudents } from "../../../hooks/useStudents";
import { useQRCodes } from "../../../hooks/useQRCodes";

import EditableField from "../../../components/ui/EditableFields";
import Spinner from "../../../components/ui/Spinner";
import ConfirmationModal from "../../../components/common/modals/ConfirmationModal";
import PrimaryButton from "../../../components/common/buttons/PrimaryButton";
import SecondaryButton from "../../../components/common/buttons/SecondaryButton";
import FormInput from "../../../components/auth/FormInput";
import StatusBadge from "../../../components/common/StatusBadge";

// Constants for sensitive fields that require password confirmation
const SENSITIVE_FIELDS = ["name", "email", "status"];

// Helper function to format Firestore values for display
const formatValue = (value) => {
  if (!value && value !== 0) return "-";
  if (value?.toDate) return value.toDate().toLocaleDateString();
  return value.toString();
};

// Card component (internal) - Reusable card layout for content sections
const Card = ({ children, className = "", title }) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 p-4 ${className}`}
  >
    {title && (
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
    )}
    {children}
  </div>
);

// InfoRow component (internal) - Displays a labeled information row with optional edit functionality
const InfoRow = ({ icon: Icon, label, value, onSave, editable = true }) => {
  const displayValue = formatValue(value);

  return (
    <div className="flex items-start gap-3 py-1.5">
      <Icon className="text-gray-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        {editable ? (
          <EditableField
            value={displayValue}
            onSave={onSave}
            className="font-medium text-gray-800 text-sm"
          />
        ) : (
          <p className="font-medium text-gray-800 text-sm">{displayValue}</p>
        )}
      </div>
    </div>
  );
};

// EditStudentModal component (internal) - Modal for editing student header information
const EditStudentModal = ({ isOpen, onClose, initialData, onSave }) => {
  const [editData, setEditData] = useState(initialData);
  const [error, setError] = useState(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setEditData(initialData);
      setError(null);
    }
  }, [isOpen, initialData]);

  const handleSave = async () => {
    try {
      await onSave(editData);
      onClose();
    } catch (error) {
      setError(error.message || "Failed to save changes");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Edit Student Details
        </h3>

        {error && (
          <div className="text-red-500 p-2 bg-red-50 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={editData.name}
              onChange={(e) =>
                setEditData({ ...editData, name: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData({ ...editData, status: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
          <PrimaryButton onClick={handleSave}>Continue</PrimaryButton>
        </div>
      </div>
    </div>
  );
};

// Main StudentDetails component - Displays student details and handles updates
export default function StudentDetails() {
  const { id } = useParams(); // Get student ID from URL params
  const { editStudent } = useStudents(); // Custom hook to manage student data
  const { qrCodeUrl, loading: qrLoading, error: qrError } = useQRCodes(id); // Custom hook to manage QR codes
  const { currentUser, getUserFriendlyError } = useAuth(); // Auth context for user info

  const [student, setStudent] = useState(null); // State to hold student data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [editModalOpen, setEditModalOpen] = useState(false); // Modal state for editing student
  const [confirmModalOpen, setConfirmModalOpen] = useState(false); // Confirmation modal state
  const [passwordModalOpen, setPasswordModalOpen] = useState(false); // Password confirmation modal state
  // State to hold pending updates
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    status: "",
  });
  const [pendingUpdate, setPendingUpdate] = useState(null); // State to hold pending update data
  const [password, setPassword] = useState(""); // Password state for confirmation

  // Subscribe to real-time updates for student data
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "students", id), (doc) => {
      try {
        const data = doc.data();
        if (data) {
          setStudent({ id: doc.id, ...data });
          setEditData({
            name: data.name || "",
            email: data.email || "",
            status: data.status || "",
          });
        } else {
          setStudent(null);
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to load student data");
        console.error("Error loading student:", error);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [id]);

  // Handle field updates with confirmation for sensitive fields
  const handleFieldUpdate = async (field, value) => {
    try {
      if (SENSITIVE_FIELDS.includes(field)) {
        setPendingUpdate({ type: "field", field, value });
        setConfirmModalOpen(true);
        return;
      }

      await editStudent(id, { [field]: value });
      setStudent((prev) => ({ ...prev, [field]: value }));
    } catch (error) {
      setError(getUserFriendlyError(error));
      console.error("Update failed:", error);
    }
  };

  // Handle header edit with confirmation (name, email, status)
  const handleHeaderEdit = async (data) => {
    try {
      setPendingUpdate({ type: "header", data });
      setConfirmModalOpen(true);
    } catch (error) {
      setError(getUserFriendlyError(error));
    }
  };

  // Confirms pending updates after password verification
  const confirmUpdateWithPassword = async () => {
    try {
      if (!pendingUpdate) return;

      // Verify password first
      await signInWithEmailAndPassword(auth, currentUser.email, password);

      // Perform the update based on type
      if (pendingUpdate.type === "header") {
        await editStudent(id, pendingUpdate.data);
        setStudent((prev) => ({ ...prev, ...pendingUpdate.data }));
      } else if (pendingUpdate.type === "field") {
        await editStudent(id, { [pendingUpdate.field]: pendingUpdate.value });
        setStudent((prev) => ({
          ...prev,
          [pendingUpdate.field]: pendingUpdate.value,
        }));
      }

      // Reset state
      setPasswordModalOpen(false);
      setConfirmModalOpen(false);
      setPendingUpdate(null);
      setPassword("");
    } catch (error) {
      setError(getUserFriendlyError(error));
      setPassword("");
    }
  };

  // Handle confirmation modal submission
  const handleConfirmSubmit = () => {
    setConfirmModalOpen(false);
    setPasswordModalOpen(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Student not found state
  if (!student) {
    return (
      <div className="p-6">
        <Link
          to="/students"
          className="flex items-center text-gray-700 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="mr-2" /> Back to Students
        </Link>
        <div className="text-center py-10">
          <p className="text-gray-600">Student not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-500 p-2 rounded-md mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Header with Back Button */}
      <div className="mb-4">
        <Link
          to="/students"
          className="flex items-center text-gray-700 hover:text-gray-900"
        >
          <FiArrowLeft className="mr-2" />
          <span className="text-sm font-medium">All Students</span>
        </Link>
      </div>

      {/* Profile Header */}
      <Card className="mb-4 relative">
        <button
          onClick={() => setEditModalOpen(true)}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          aria-label="Edit student details"
        >
          <FiEdit />
        </button>
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
            <FiUser className="text-gray-600" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-800 truncate">
                {formatValue(student.name)}
              </h1>
              <StatusBadge status={student.status} />
            </div>
            <p className="text-gray-600 text-sm truncate">
              {formatValue(student.email)}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">ID: {id}</p>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Personal Details Card */}
        <Card title="Personal Details">
          <div className="space-y-2">
            <InfoRow
              icon={FiCalendar}
              label="Age"
              value={student.age}
              onSave={(value) => handleFieldUpdate("age", value)}
            />
            <InfoRow
              icon={FiCalendar}
              label="Date of Birth"
              value={student.date_of_birth}
              onSave={(value) => handleFieldUpdate("date_of_birth", value)}
            />
            <InfoRow
              icon={FiMapPin}
              label="Address"
              value={student.address}
              onSave={(value) => handleFieldUpdate("address", value)}
            />
          </div>
        </Card>

        {/* Parent Information Card */}
        <Card title="Parent Information">
          <div className="space-y-2">
            <InfoRow
              icon={FiUser}
              label="Parent Name"
              value={student.parent_name}
              onSave={(value) => handleFieldUpdate("parent_name", value)}
            />
            <InfoRow
              icon={FiPhone}
              label="Phone"
              value={student.parent_phone}
              onSave={(value) => handleFieldUpdate("parent_phone", value)}
            />
            <InfoRow
              icon={FiMail}
              label="Email"
              value={student.parent_email}
              onSave={(value) => handleFieldUpdate("parent_email", value)}
            />
          </div>
        </Card>

        {/* Student ID Card */}
        <Card title="Student Identification">
          <div className="flex flex-col items-center">
            <div className="bg-gray-50 rounded-lg p-3 mb-3 w-full flex justify-center border border-gray-200">
              <div className="bg-white p-2 rounded border border-gray-200">
                {qrLoading ? (
                  <div className="w-72 h-72 flex items-center justify-center">
                    <Spinner size="md" />
                  </div>
                ) : qrError ? (
                  <div className="w-72 h-72 flex items-center justify-center text-red-500 text-xs">
                    Error loading QR
                  </div>
                ) : qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Student QR Code"
                    className="w-72 h-72 object-contain"
                  />
                ) : (
                  <div className="w-72 h-72 bg-gray-100 flex items-center justify-center">
                    <span className="text-xs text-gray-400">No QR Code</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Emergency Contact Card */}
        <Card title="Emergency Contact">
          <div className="space-y-2">
            <InfoRow
              icon={FiUser}
              label="Contact Name"
              value={student.emergency_contact_name}
              onSave={(value) =>
                handleFieldUpdate("emergency_contact_name", value)
              }
            />
            <InfoRow
              icon={FiPhone}
              label="Phone"
              value={student.emergency_contact_phone}
              onSave={(value) =>
                handleFieldUpdate("emergency_contact_phone", value)
              }
            />
            <InfoRow
              icon={FiMail}
              label="Email"
              value={student.emergency_contact_email}
              onSave={(value) =>
                handleFieldUpdate("emergency_contact_email", value)
              }
            />
          </div>
          {/* Student ID Expiry Info */}
          {student?.id_expiry_date ? (
            <div className="mt-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Additional Info
              </h3>
              <div className="w-full">
                <InfoRow
                  icon={FiCreditCard}
                  label="ID Expiry Date"
                  value={student?.id_expiry_date}
                  onSave={(value) => handleFieldUpdate("id_expiry_date", value)}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </Card>
      </div>

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialData={editData}
        onSave={handleHeaderEdit}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onCancel={() => {
          setConfirmModalOpen(false);
          setPendingUpdate(null);
        }}
        onConfirm={handleConfirmSubmit}
        title="Confirm Update"
        message={
          pendingUpdate?.type === "header"
            ? "You're about to update sensitive student information. This action requires additional verification."
            : `You're about to update the student's ${pendingUpdate?.field}. This action requires additional verification.`
        }
        confirmText="Continue"
        cancelText="Cancel"
      />

      {/* Password Confirmation Modal */}
      <ConfirmationModal
        isOpen={passwordModalOpen}
        onCancel={() => {
          setPasswordModalOpen(false);
          setPassword("");
        }}
        onConfirm={confirmUpdateWithPassword}
        title="Verify Your Identity"
        message={
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-2">
              For security reasons, please enter your password to confirm these
              changes:
            </p>
            <div className="relative">
              <FormInput
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon="lock"
                required
                minLength={8}
              />
            </div>
          </div>
        }
        confirmText="Confirm Changes"
        cancelText="Cancel"
        destructive={false}
      />
    </div>
  );
}
