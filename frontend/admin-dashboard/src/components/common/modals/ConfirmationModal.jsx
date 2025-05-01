import PropTypes from "prop-types";
import { IoWarningOutline } from "react-icons/io5";
import { FiAlertTriangle } from "react-icons/fi";

import PrimaryButton from "../buttons/PrimaryButton";
import SecondaryButton from "../buttons/SecondaryButton";

export default function ConfirmationModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = false,
  isOpen = true,
  icon,
}) {
  if (!isOpen) return null; // If the modal is not open, return null

  const IconComponent =
    icon || (destructive ? FiAlertTriangle : IoWarningOutline); // Default icon based on the destructive prop

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex flex-col space-y-4">
          {/* Icon and Title Row */}
          <div className="flex items-start space-x-3">
            <div
              className={`flex-shrink-0 pt-0.5 ${
                destructive ? "text-red-600" : "text-primary"
              }`}
            >
              <IconComponent size={24} />
            </div>
            <div>
              <h3
                className={`text-lg font-semibold ${
                  destructive ? "text-red-600" : "text-primary"
                }`}
              >
                {title}
              </h3>
            </div>
          </div>

          {/* Message */}
          <div className="ml-9 -mt-2">
            {" "}
            {/* Adjusted margin to align with title */}
            <p className="text-sm text-gray-600">{message}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-2">
            <SecondaryButton onClick={onCancel}>{cancelText}</SecondaryButton>
            <PrimaryButton
              onClick={onConfirm}
              className={
                destructive
                  ? "bg-red-600 hover:text-red-600 focus-visible:ring-red-500 border-red-600"
                  : ""
              }
            >
              {confirmText}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

// Prop types for ConfirmationModal
ConfirmationModal.propTypes = {
  title: PropTypes.string.isRequired, // Title of the modal
  message: PropTypes.string.isRequired, // Message to display in the modal
  onConfirm: PropTypes.func.isRequired, // Callback function for confirm action
  onCancel: PropTypes.func.isRequired, // Callback function for cancel action
  confirmText: PropTypes.string, // Text for the confirm button
  cancelText: PropTypes.string, // Text for the cancel button
  destructive: PropTypes.bool, // If true, indicates a destructive action
  isOpen: PropTypes.bool, // If true, the modal is open
  icon: PropTypes.elementType, // Custom icon component to display in the modal
};

// Default props for ConfirmationModal
ConfirmationModal.defaultProps = {
  confirmText: "Confirm",
  cancelText: "Cancel",
  destructive: false,
  isOpen: true,
  icon: null, // Default to null if no icon is provided
};
