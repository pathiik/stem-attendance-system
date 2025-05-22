import { useState } from "react";
import PropTypes from "prop-types";

import { FiEdit, FiSave, FiX } from "react-icons/fi";

// EditableField - A component that displays a field that can be toggled between view and edit modes
export default function EditableField({
  label,
  value,
  onSave,
  icon,
  inputType = "text",
  validate,
  isLoading = false,
  className = "",
}) {
  const [isEditing, setIsEditing] = useState(false); // State to track if the field is in edit mode
  const [editValue, setEditValue] = useState(value); // State to track the current value in edit mode
  const [error, setError] = useState(null); // State to track validation errors

  // Handles saving the edited value with validation
  const handleSave = () => {
    if (validate) {
      const validationError = validate(editValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setError(null);
    onSave(editValue);
    setIsEditing(false);
  };

  // Handles canceling the edit and reverts to original value
  const handleCancel = () => {
    setEditValue(value);
    setError(null);
    setIsEditing(false);
  };

  // Handles key events in the input field (Enter to save, Escape to cancel)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className={`flex items-start border-b border-gray-100 pb-4 ${className}`}
    >
      {/* Icon container (left side) */}
      {icon && <div className="text-gray-500 mr-3 mt-1">{icon}</div>}

      {/* Main content area */}
      <div className="flex-1">
        {/* Field label */}
        <div className="text-sm text-gray-500">{label}</div>

        {/* Conditional rendering based on edit mode */}
        {isEditing ? (
          <div className="mt-1">
            <div className="flex items-center space-x-2">
              {/* Input field in edit mode */}
              <input
                type={inputType}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className={`flex-1 p-2 border ${
                  error ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-1 focus:ring-primary`}
                aria-invalid={!!error}
                aria-describedby={error ? `${label}-error` : undefined}
              />

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="p-2 text-green-600 hover:text-green-800 disabled:opacity-50"
                aria-label="Save changes"
                title="Save"
              >
                <FiSave />
              </button>

              {/* Cancel button */}
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                aria-label="Cancel editing"
                title="Cancel"
              >
                <FiX />
              </button>
            </div>

            {/* Error message display */}
            {error && (
              <p id={`${label}-error`} className="mt-1 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>
        ) : (
          // View mode
          <div className="flex items-center justify-between mt-1">
            <div className="font-medium">
              {value || <span className="text-gray-400">Not set</span>}
            </div>

            {/* Edit button */}
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-500 hover:text-primary"
              aria-label={`Edit ${label}`}
            >
              <FiEdit title="Edit" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Prop types for the EditableField
EditableField.propTypes = {
  label: PropTypes.string.isRequired, // Label for the field
  value: PropTypes.string.isRequired, // Current value of the field
  onSave: PropTypes.func.isRequired, // Callback when saving changes
  icon: PropTypes.node, // Optional icon to display
  inputType: PropTypes.string, // Input type (text, number, etc.)
  validate: PropTypes.func, // Validation function
  isLoading: PropTypes.bool, // Loading state
  className: PropTypes.string, // Additional CSS classes
};

// Default props for the EditableField
EditableField.defaultProps = {
  inputType: "text",
  isLoading: false,
  className: "",
};
