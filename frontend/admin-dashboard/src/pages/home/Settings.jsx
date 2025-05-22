import { useState } from "react";
import { FiUser, FiMail, FiLock, FiSave } from "react-icons/fi";

// Settings component - Allows the user to view and edit their profile settings (CURRENTLY UNIMPLEMENTED)
export default function Settings() {
  const [editMode, setEditMode] = useState(false); // State to manage edit mode
  // State to manage profile data
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@stem.ca",
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(""); // State to manage error messages
  const [success, setSuccess] = useState(""); // State to manage success messages

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validate password change if in edit mode
    if (
      editMode &&
      profile.newPassword &&
      profile.newPassword !== profile.confirmPassword
    ) {
      setError("New passwords do not match");
      return;
    }

    // TODO: Implement API call to update profile
    setSuccess("Profile updated successfully");
    setTimeout(() => setSuccess(""), 3000);
    setEditMode(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>

      {/* Success and error messages */}
      {success && (
        <div className="p-3 bg-green-50 border-l-4 border-green-500 text-green-700 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Profile Settings</h2>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiSave className="mr-2" />
              Save Changes
            </button>
          )}
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                  <FiUser size={24} className="text-gray-600" />
                </div>
                {editMode && (
                  <button
                    type="button"
                    className="text-primary hover:underline"
                  >
                    Change Photo
                  </button>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {editMode ? (
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded-lg">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                {editMode ? (
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                ) : (
                  <p className="p-2 bg-gray-50 rounded-lg">{profile.email}</p>
                )}
              </div>
            </div>

            {editMode && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={profile.password}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={profile.newPassword}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={profile.confirmPassword}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
