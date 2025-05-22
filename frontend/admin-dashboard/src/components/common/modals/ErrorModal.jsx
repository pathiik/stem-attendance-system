import PropTypes from "prop-types";

import PrimaryButton from "../buttons/PrimaryButton";

// ErrorModal - A modal component for displaying error messages
export default function ErrorModal({
  title,
  message,
  onClose,
  closeText = "Close",
}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog" // Role for accessibility
      aria-modal="true" // Indicates that this is a modal dialog
    >
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-red-600">{title}</h2>
        <p className="mt-2 text-gray-700">{message}</p>
        <div className="mt-4 flex justify-end">
          <PrimaryButton onClick={onClose} autoFocus>
            {closeText}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// Prop types for ErrorModal
ErrorModal.propTypes = {
  title: PropTypes.string.isRequired, // Title of the modal
  message: PropTypes.string.isRequired, // Error message to display
  onClose: PropTypes.func.isRequired, // Function to call when closing the modal
  closeText: PropTypes.string, // Text for the close button
};

// Default props for ErrorModal
ErrorModal.defaultProps = {
  closeText: "Close",
};
